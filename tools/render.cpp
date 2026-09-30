// Headless JSFX renderer: raw float32 stereo in -> raw float32 stereo out.
// usage: render fx.jsfx in.f32 out.f32 srate [slider=value ...]
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>
#include <chrono>
#include <cmath>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
int main(int argc,char**argv){
  if(argc<5){fprintf(stderr,"usage\n");return 1;}
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, argv[1]);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)){fprintf(stderr,"load failed\n");return 2;}
  if(!ysfx_compile(fx,0)){fprintf(stderr,"compile failed\n");return 3;}
  double sr=atof(argv[4]);
  ysfx_set_sample_rate(fx,sr); ysfx_set_block_size(fx,256);
  ysfx_init(fx);
  for(int i=5;i<argc;i++){ int idx; double v; if(sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true); }
  FILE*fi=fopen(argv[2],"rb"); if(!fi){fprintf(stderr,"no input\n");return 4;}
  std::vector<float> in; float buf[4096]; size_t n;
  while((n=fread(buf,sizeof(float),4096,fi))>0) in.insert(in.end(),buf,buf+n); fclose(fi);
  size_t frames=in.size()/2; std::vector<float> out(frames*2);
  const int B=256; float l[B],r[B],ol[B],orr[B];
  auto t0=std::chrono::steady_clock::now();
  size_t bad=0;
  for(size_t p=0;p<frames;p+=B){ int m=(int)std::min((size_t)B,frames-p);
    for(int k=0;k<m;k++){l[k]=in[2*(p+k)];r[k]=in[2*(p+k)+1];}
    const float*ins[2]={l,r}; float*outs[2]={ol,orr};
    ysfx_process_float(fx,ins,outs,2,2,m);
    for(int k=0;k<m;k++){ if(!std::isfinite(ol[k])||!std::isfinite(orr[k])) bad++; out[2*(p+k)]=ol[k]; out[2*(p+k)+1]=orr[k]; }
  }
  double el=std::chrono::duration<double>(std::chrono::steady_clock::now()-t0).count();
  FILE*fo=fopen(argv[3],"wb"); fwrite(out.data(),sizeof(float),out.size(),fo); fclose(fo);
  fprintf(stderr,"rendered %.2fs audio in %.3fs (%.1f%% realtime CPU), nonfinite=%zu\n", frames/sr, el, 100.0*el/(frames/sr), bad);
  ysfx_free(fx); return bad?5:0;
}
