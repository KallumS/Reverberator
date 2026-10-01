// Run a JSFX's @gfx headlessly and save what it draws.
//
// usage: gui fx.jsfx out.bgra width height scale [slider=value ...]
//   env AUDIO=file.f32   feed this raw float32 stereo through @sample first
//                        (and keep feeding it in step with the frames)
//   env EVENTS="x,y,buttons,wheel;..."  mouse state per frame, in logical
//                        pixels; buttons: 1 left, 2 right, 64 middle;
//                        mods via "x,y,b,wheel,mods" (1 shift, 2 ctrl, 4 alt)
//   env VARS=a,b         print these plugin variables at the end
//   env FRAMES=n         frames to run after the events (default 2)
// Writes raw BGRA to out.bgra (width*scale x height*scale) and prints the
// final value of every slider, so a test can check what a click changed.
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>

static void logr(intptr_t, ysfx_log_level l, const char *m) { fprintf(stderr, "[%s] %s\n", ysfx_log_level_string(l), m); }
static int32_t menu(void *, const char *, int32_t, int32_t) { return 0; }
static void cursor(void *, int32_t) {}
static const char *drop(void *, int32_t) { return nullptr; }

int main(int argc, char **argv)
{
    if (argc < 6) { fprintf(stderr, "usage\n"); return 1; }
    ysfx_config_t *c = ysfx_config_new();
    ysfx_set_log_reporter(c, &logr);
    ysfx_guess_file_roots(c, argv[1]);
    ysfx_t *fx = ysfx_new(c);
    ysfx_config_free(c);
    if (!ysfx_load_file(fx, argv[1], 0) || !ysfx_compile(fx, 0)) { fprintf(stderr, "load/compile failed\n"); return 2; }
    const double sr = 48000;
    ysfx_set_sample_rate(fx, sr);
    ysfx_set_block_size(fx, 256);
    ysfx_init(fx);
    for (int i = 6; i < argc; i++) {
        int idx; double v;
        if (sscanf(argv[i], "%d=%lf", &idx, &v) == 2) ysfx_slider_set_value(fx, idx - 1, v, true);
    }

    int W = atoi(argv[3]), H = atoi(argv[4]);
    double scale = atof(argv[5]);
    int PW = (int)(W * scale), PH = (int)(H * scale);
    std::vector<uint8_t> px((size_t)PW * PH * 4, 0);
    ysfx_gfx_config_t gc{};
    gc.pixel_width = PW; gc.pixel_height = PH; gc.pixel_stride = PW * 4;
    gc.pixels = px.data(); gc.scale_factor = scale;
    gc.show_menu = &menu; gc.set_cursor = &cursor; gc.get_drop_file = &drop;
    ysfx_gfx_setup(fx, &gc);

    std::vector<float> audio;
    if (const char *a = getenv("AUDIO")) {
        FILE *f = fopen(a, "rb");
        if (f) { float b[4096]; size_t n; while ((n = fread(b, 4, 4096, f)) > 0) audio.insert(audio.end(), b, b + n); fclose(f); }
    }
    size_t pos = 0;
    const int B = 256;
    float l[B], r[B], ol[B], orr[B];
    auto step_audio = [&](int blocks) {
        for (int k = 0; k < blocks; k++) {
            for (int i = 0; i < B; i++) {
                bool have = pos + 1 < audio.size();
                l[i] = have ? audio[pos] : 0.f; r[i] = have ? audio[pos + 1] : 0.f;
                if (have) pos += 2;
            }
            const float *ins[2] = {l, r}; float *outs[2] = {ol, orr};
            ysfx_process_float(fx, ins, outs, 2, 2, B);
        }
    };
    int pre = getenv("PREBLOCKS") ? atoi(getenv("PREBLOCKS")) : 8;
    step_audio(pre);
    ysfx_gfx_run(fx);

    std::string ev = getenv("EVENTS") ? getenv("EVENTS") : "";
    size_t p = 0;
    while (p < ev.size()) {
        size_t q = ev.find(';', p); if (q == std::string::npos) q = ev.size();
        int x = 0, y = 0, b = 0, mods = 0; double wheel = 0;
        sscanf(ev.substr(p, q - p).c_str(), "%d,%d,%d,%lf,%d", &x, &y, &b, &wheel, &mods);
        ysfx_gfx_update_mouse(fx, mods, (int)(x * scale), (int)(y * scale), b, wheel, 0);
        ysfx_gfx_run(fx);
        step_audio(1);
        p = q + 1;
    }
    int frames = getenv("FRAMES") ? atoi(getenv("FRAMES")) : 2;
    for (int i = 0; i < frames; i++) { step_audio(8); ysfx_gfx_run(fx); }

    FILE *o = fopen(argv[2], "wb");
    fwrite(px.data(), 1, px.size(), o);
    fclose(o);
    if (const char *vs = getenv("VARS")) {
        std::string v = vs; size_t a = 0;
        while (a < v.size()) { size_t b = v.find(',', a); if (b == std::string::npos) b = v.size();
            std::string n = v.substr(a, b - a); printf("%s=%g\n", n.c_str(), ysfx_read_var(fx, n.c_str())); a = b + 1; }
    }
    for (uint32_t i = 0; i < 64; i++)
        if (ysfx_slider_exists(fx, i)) printf("slider%u=%g\n", i + 1, ysfx_slider_get_value(fx, i));
    ysfx_free(fx);
    return 0;
}
