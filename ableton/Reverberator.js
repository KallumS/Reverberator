/* Reverberator - built by ableton/kit/build.py from ableton/device.json. Do not edit; edit the sources and rebuild. */
var DEVICE = {"audio": true, "main": "Reverberator.jsfx", "title": "Reverberator"};
DEVICE.files = {"Reverberator.jsfx": "desc:Reverberator \u00e2\u0080\u0094 Material Reverb (Physically Modelled)\n//tags: reverb physical-modelling plate spring\n//author: KallumS\n//\n// Sends audio through a physical model of an odd material, the way a plate\n// reverb sends it through a steel sheet. Every material is described by its\n// real physical constants -- Young's modulus, density, thickness, tension,\n// loss factor -- and the resonances, decay times and echo density are derived\n// from them. See README.md and docs/PHYSICS.md for the reasoning and numbers.\n\nslider1:0<0,19,1{Chain Link Fence,Ice Sheet,Tension Wire,Gong,PVC Pipe,Glass,Marble,Car Body Panel,Leather,Wine Bottle,Piano String,Guitar String,Violin String,Steel Handpan,Toilet Roll Tube,Aluminium Foil,Cling Film,Corrugated Tin Roof,Metal Barrel,Bone}>-Material\nslider2:35<0,100,0.1>-Mix (%)\nslider3:100<25,400,1:log=100>-Size (%)\nslider4:100<10,400,1:log=100>-Decay (%)\nslider5:0<-100,100,1>-Brightness\nslider6:0<-12,12,0.1>-Tuning (semitones)\nslider7:0<0,250,1>-Pre-Delay (ms)\nslider8:30<0,100,1>-Drive (%)\nslider9:100<0,150,1>-Width (%)\nslider10:20<20,1000,1:log=150>-Low Cut (Hz)\nslider11:20000<1000,20000,10:log=5000>-High Cut (Hz)\nslider12:0<-24,12,0.1>-Output (dB)\n\nin_pin:Left input\nin_pin:Right input\nout_pin:Left output\nout_pin:Right output\n\n@init\n\n// ---------------------------------------------------------------------------\n// Memory map (units: EEL memory slots)\n// ---------------------------------------------------------------------------\nWG_MAX = 32;   WG_STRIDE = 24;  WG_BASE = 0;       // waveguide descriptors\nMOD_MAX = 64;  MOD_STRIDE = 12;   MOD_BASE = 1024;    // modal resonators\nFDN_STRIDE = 16;                FDN_BASE = 2048;    // 8 FDN line descriptors\nFDN_TMP = 2200;                             // FDN scratch (8)\nFDN_SIGN = 2210;                             // FDN input sign rows (2 x 8)\nPLATE_TMP = 2400;                             // plate-mode candidates (3 x 196)\nBESSEL_TAB = 3100;                              // Bessel zeros table (2 x 24)\nDPOOL0 = 4096; DPOOL_END = 131072;      // dispersion allpass states\nPOOL0 = 131072; POOL_END = 8300000;     // delay lines\n\n// ---------------------------------------------------------------------------\n// Air at 20 C (same constants as Trombolese's constants.py)\n// ---------------------------------------------------------------------------\nC_AIR = 343.2; RHO_AIR = 1.204; NU_AIR = 0.00001506; GAM_AIR = 1.4017; PR_AIR = 0.708;\n// Kirchhoff wide-tube boundary layer: alpha = sqrt(omega/2) * BLC / (a c)\nBLC = sqrt(NU_AIR) + (GAM_AIR - 1)*sqrt(NU_AIR/PR_AIR);\n\n// FDN input sign rows: Hadamard rows 7 (mono) and 4 (side)\nfunction hsign(r, c) local(v, n) ( v = r & c; n = 0; loop(3, n += v & 1; v = v >> 1;); 1 - 2*(n & 1); );\ni = 0; loop(8, FDN_SIGN[i] = hsign(7, i); FDN_SIGN[8+i] = hsign(4, i); i += 1;);\n\n// Circular-membrane Bessel zeros j_mn and their angular order m, sorted\ni = 0;\nfunction jz(j, m) ( BESSEL_TAB[i*2] = j; BESSEL_TAB[i*2+1] = m; i += 1; );\njz(2.4048,0); jz(3.8317,1); jz(5.1356,2); jz(5.5201,0); jz(6.3802,3); jz(7.0156,1);\njz(7.5883,4); jz(8.4172,2); jz(8.6537,0); jz(8.7715,5); jz(9.7610,3); jz(9.9361,6);\njz(10.1735,1); jz(11.0647,4); jz(11.0864,7); jz(11.6198,2); jz(11.7915,0); jz(12.2251,8);\njz(12.3386,5); jz(13.0152,3); jz(13.3237,1); jz(13.3543,9); jz(13.5893,6); jz(14.4755,10);\n\n// ---------------------------------------------------------------------------\n// Physics helpers\n// ---------------------------------------------------------------------------\n\n// Decay time from a structural loss factor. A mode loses energy at\n// sigma = pi f eta, so T60 = 6.91 / (pi f eta) = 2.2 / (f eta); tmax caps it\n// for the losses eta does not describe (supports, radiation, air).\nfunction t60e(f, eta, tmax) ( 1/(1/tmax + f*eta/2.2); );\n\n// Brightness tilt for modes: full effect above ~4 kHz, none below 500 Hz.\nfunction brt(f) local(x) ( x = log(max(f, 1)/500)/log(8); bm^max(0, min(1, x)); );\n\n// Bessel function of the first kind by its power series (fine for x < 15).\nfunction besj(m, x) local(s, t, k, hx)\n(\n  hx = 0.5*x; t = 1; k = 1;\n  loop(m, t *= hx/k; k += 1;);\n  s = t; k = 1;\n  loop(40, t *= -hx*hx/(k*(k + m)); s += t; k += 1;);\n  s;\n);\n\n// First-order allpass: group delay and (unwrapped) phase lag, in samples/rad.\nfunction gd1(w, a) ( (1 - a*a)/(1 + 2*a*cos(w) + a*a); );\nfunction ph1(w, a) ( w - 2*atan(a*sin(w)/(1 + a*cos(w))); );\n// One-pole lowpass b/(1 - p z^-1): phase lag and group delay.\nfunction phlp(w, p) ( atan2(p*sin(w), 1 - p*cos(w)); );\nfunction gdlp(w, p) ( (p*cos(w) - p*p)/(1 - 2*p*cos(w) + p*p); );\n\n// Fit a one-pole lowpass to per-pass gains ga (at DC) and gb (at wb).\n// Matching at DC keeps the loop gain below one at every frequency.\nfunction op_fit(ga, gb, wb) local(R2, cb, A, B, disc)\n(\n  ga = min(ga, 0.9999995); gb = min(gb, ga);\n  R2 = (gb/ga)^2;\n  R2 > 0.999999 ? ( op_p = 0; op_b = ga; ) : (\n    cb = cos(wb); A = 1 - R2; B = 1 - R2*cb;\n    disc = max(0, B*B - A*A);\n    op_p = max(0, min(0.9995, (B - sqrt(disc))/A));\n    op_b = ga*(1 - op_p);\n  );\n);\n\n// Impulse-response energy of a feedback loop whose only non-allpass element\n// is the one-pole b/(1 - p z^-1): the mean over frequency of |H|^2/(1 - |H|^2),\n// which integrates in closed form to b^2 / sqrt((1 + p^2 - b^2)^2 - 4 p^2).\nfunction loop_energy(b, p) local(A) ( A = 1 + p*p - b*b; b*b/sqrt(max(0.000000000001, A*A - 4*p*p)); );\n\n// Stretched-allpass dispersion: difference in group delay between wa and wb.\nfunction disp_diff(a) ( dd_M*dd_K*(gd1(dd_K*dd_wa, a) - gd1(dd_K*dd_wb, a)); );\n\n// Solve the allpass coefficient that makes low frequencies (wa) lag high\n// ones (wb) by dlt samples. Stiff and flexural waves carry high frequencies\n// faster, so the answer is a negative coefficient. Clamped at disp_lim: past\n// it the delay piles up in the bass instead of spreading across the band.\n// Each stage can only contribute pi radians of phase, so a realistic\n// 100 ms chirp would need ~1000 stages; the clamp keeps the chirp's *shape*\n// and lets the recirculating echoes build its length.\nfunction disp_solve(dlt) local(lo, hi, mid)\n(\n  (dd_M <= 0 || dlt <= 0) ? 0 : (\n    lo = disp_lim; hi = 0;\n    disp_diff(lo) <= dlt ? lo : (\n      loop(40, mid = 0.5*(lo + hi); disp_diff(mid) > dlt ? lo = mid : hi = mid;);\n      0.5*(lo + hi);\n    );\n  );\n);\n\n// ---------------------------------------------------------------------------\n// Engine 1: waveguides (strings, wires, air columns, dispersive paths)\n// Parameters are passed in wg_* globals, physical (unscaled) values.\n// ---------------------------------------------------------------------------\nfunction wg_make() local(p, fa, fb, Ta, Tb, wa, wb, a, t60a, t60b, ga, gb, w1, rest, Dt, N, d, c, len, fmx, st)\n(\n  p = WG_BASE + n_wg*WG_STRIDE;\n  (n_wg < WG_MAX && !(do_alloc && alloc_full) && (do_alloc || n_wg < wg_cnt1)) ? (\n    fmx = 0.4*srate/wg_K;\n    fa = wg_fa*fsc; fb = min(wg_fb*fsc, fmx);\n    Ta = wg_Ta/fsc; Tb = wg_Tb/fsc;\n    wa = 2*$pi*fa/srate; wb = 2*$pi*fb/srate;\n\n    // dispersion\n    dd_M = wg_M; dd_K = wg_K; dd_wa = wa; dd_wb = wb;\n    a = disp_solve((Ta - Tb)*srate);\n\n    // losses: per-pass gains from T60 at the two reference frequencies\n    t60a = wg_t60a*tsc; t60b = min(t60a, wg_t60b*tsc*bm);\n    ga = 10^(-3*Ta/t60a); gb = 10^(-3*Tb/t60b);\n    op_fit(ga, gb, wb);\n\n    // tuning: pitched loops put the fundamental's total phase lag at 2pi\n    // (or pi for a loop with an inverting reflection); others meet the\n    // group delay at wb.\n    wg_pitched ? (\n      w1 = 2*$pi*wg_f1*fsc/srate;\n      rest = wg_phase - wg_M*ph1(wg_K*w1, a) - phlp(w1, op_p);\n      Dt = rest/w1;\n    ) : (\n      w1 = wb;\n      Dt = Tb*srate - wg_M*wg_K*gd1(wg_K*wb, a) - gdlp(wb, op_p);\n    );\n    N = floor(Dt - 0.5); N < 2 ? N = 2;\n    d = Dt - N; d < 0.1 ? d = 0.1;\n    c = (1 - d)/(1 + d);\n    // refine the Thiran fraction against its exact phase at the tuning point\n    wg_pitched ? loop(3,\n      d += (Dt - N) - ph1(w1, c)/w1; d = max(0.1, min(1.9, d)); c = (1 - d)/(1 + d);\n    );\n\n    do_alloc ? (\n      len = N + 8;\n      st = 2*wg_M*wg_K;\n      (pool_ptr + len < POOL_END && dpool + st < DPOOL_END) ? (\n        p[0] = pool_ptr; p[1] = len; p[2] = 0; pool_ptr += len;\n        p[13] = dpool; dpool += st;\n        p[5] = p[6] = p[9] = 0;\n      ) : alloc_full = 1;\n    ) : (\n      N = min(N, p[1] - 2);\n    );\n\n    !(do_alloc && alloc_full) ? (\n      p[3] = N; p[4] = c;\n      p[7] = op_b*wg_sign; p[8] = op_p;\n      p[10] = wg_M; p[11] = a; p[12] = wg_K;\n      p[14] = wg_gin; p[15] = wg_pl; p[16] = wg_pr;\n      p[17] = loop_energy(op_b, op_p);\n      p[18] = wg_pitched ? wg_f1*fsc : 0;    // for the GUI: fundamental (0 = chirp path)\n      p[19] = t60a;\n      n_wg += 1;\n    );\n  );\n);\n\n// Stiff string: f_n = n f0 sqrt(1 + B n^2). Local partial spacing gives the\n// loop group delay, T(n) = sqrt(1 + B n^2) / (f0 (1 + 2 B n^2)).\nfunction string_add(f0, B, eta, tmax, M, K, gin, pl, pr) local(n, ft)\n(\n  wg_pitched = 1; wg_phase = 2*$pi; wg_sign = 1;\n  wg_f1 = f0*sqrt(1 + B);\n  wg_fa = wg_f1; wg_Ta = sqrt(1 + B)/(f0*(1 + 2*B));\n  ft = min(4000, 0.3*srate/(fsc*K));\n  n = ft/f0;\n  loop(30, n = 0.5*(n + ft/(f0*sqrt(1 + B*n*n))););\n  n = max(n, 2);\n  wg_fb = n*f0*sqrt(1 + B*n*n); wg_Tb = sqrt(1 + B*n*n)/(f0*(1 + 2*B*n*n));\n  wg_t60a = t60e(wg_fa, eta, tmax); wg_t60b = t60e(wg_fb, eta, tmax);\n  wg_M = M; wg_K = K; wg_gin = gin; wg_pl = pl; wg_pr = pr;\n  wg_make();\n);\n\n// A round steel/metal wire from its geometry: f0 = sqrt(T/mu)/2L,\n// B = pi^3 E d^4 / (64 T L^2).\nfunction wire_add(L, d, T, rho, E, eta, tmax, M, K, gin, pl, pr) local(mu)\n(\n  mu = rho*$pi*d*d/4;\n  string_add(sqrt(T/mu)/(2*L), $pi^3*E*d^4/(64*T*L*L), eta, tmax, M, K, gin, pl, pr);\n);\n\n// Air column (from Trombolese): viscothermal boundary-layer attenuation,\n// alpha = sqrt(pi f) BLC / (a c), which also slows the wave slightly\n// (Re k = w/c + alpha), so the partials sit flat and a little stretched.\nfunction tube_alpha(f, a) ( sqrt($pi*f)*BLC/(a*C_AIR); );\n\n// ends: 2 = open-open, 1 = closed-open, 0 = closed-closed (a sealed cavity:\n// no end correction, no radiation, no inversion). wall multiplies the\n// boundary-layer loss for rough/porous walls (cardboard, bone).\nfunction tube_add(L, a, ends, wall, gin, pl, pr) local(Le, f, k, ft, ga, gb, ka, rad_a, rad_b)\n(\n  Le = L + ends*0.6133*a;                     // unflanged end correction\n  k = ends == 1 ? 0.5 : 1;\n  f = k*C_AIR/(2*Le);\n  loop(8, f = k*C_AIR/(2*Le)/(1 + tube_alpha(f, a)*C_AIR/(2*$pi*f)););\n  wg_pitched = 1; wg_phase = ends == 1 ? $pi : 2*$pi; wg_sign = ends == 1 ? -1 : 1;\n  wg_f1 = f; wg_fa = f;\n  ft = min(4000, 0.3*srate/fsc);\n  wg_fb = ft;\n  wg_Ta = 2*Le*(1/C_AIR + tube_alpha(f, a)/(4*$pi*f));\n  wg_Tb = 2*Le*(1/C_AIR + tube_alpha(ft, a)/(4*$pi*ft));\n  // radiation at each open end: |R| ~ exp(-(ka)^2 / 2)\n  ka = 2*$pi*f*a/C_AIR;  rad_a = exp(-0.5*ka*ka*ends);\n  ka = 2*$pi*ft*a/C_AIR; rad_b = exp(-0.5*ka*ka*ends);\n  ga = exp(-2*Le*wall*tube_alpha(f, a))*rad_a;\n  gb = exp(-2*Le*wall*tube_alpha(ft, a))*rad_b;\n  wg_t60a = -6.9078*wg_Ta/log(min(ga, 0.99999));\n  wg_t60b = -6.9078*wg_Tb/log(max(min(gb, 0.99999), 0.000001));\n  wg_M = 2; wg_K = 1; wg_gin = gin; wg_pl = pl; wg_pr = pr;\n  wg_make();\n);\n\n// A non-pitched dispersive path: group delay Ta at fa, Tb at fb. The\n// allpasses are stretched (z^-K) so the chirp's budget is spent across\n// 0-6 kHz rather than the whole band; the images above 6 kHz are kept out\n// by the 4th-order lowpass on the waveguide input (wg_lp).\nfunction chirp_add(fa, Ta, fb, Tb, t60a, t60b, M, gin, pl, pr)\n(\n  wg_pitched = 0; wg_sign = 1; wg_phase = 2*$pi; wg_f1 = fa;\n  wg_fa = fa; wg_Ta = Ta; wg_fb = fb; wg_Tb = Tb;\n  wg_t60a = t60a; wg_t60b = t60b;\n  wg_M = M; wg_K = max(1, floor(srate/12000 + 0.5)); wg_gin = gin; wg_pl = pl; wg_pr = pr;\n  disp_lim = -0.72;\n  wg_make();\n  disp_lim = -0.9;\n);\n\n// ---------------------------------------------------------------------------\n// Engine 2: modal resonators (the strong, individually audible modes)\n// ---------------------------------------------------------------------------\nfunction mode_add(f, eta, tmax, amp, wl, wr) local(p, t60, r, th, fs)\n(\n  f = sqrt(f*f + curv_fr*curv_fr);            // curved shells stiffen low modes\n  fs = f*fsc;\n  (fs > 16 && fs < 0.45*srate && n_modes < MOD_MAX && (do_alloc || n_modes < mod_cnt1)) ? (\n    p = MOD_BASE + n_modes*MOD_STRIDE;\n    t60 = t60e(f, eta, tmax)*tsc*brt(fs);\n    r = exp(-6.907755/(t60*srate)); r = min(r, 0.9999999);\n    th = 2*$pi*fs/srate;\n    p[0] = 2*r*cos(th); p[1] = r*r;\n    do_alloc ? ( p[2] = 0; p[3] = 0; );\n    p[4] = amp*wl*sin(th); p[5] = amp*wr*sin(th);\n    p[6] = 2*r*th*sin(th);                    // d(coef)/d(relative pitch), for glide\n    p[7] = amp*wl; p[8] = amp*wr; p[9] = r;\n    p[10] = fs; p[11] = t60;                  // for the GUI\n    n_modes += 1;\n  );\n);\n\n// Rectangular plate, simply supported, orthotropic in general:\n// f = (pi/2) sqrt( (Dx (m/Lx)^4 + 2H (mn/LxLy)^2 + Dy (n/Ly)^4) / (rho h) )\n// Driven at (0.37, 0.43), picked up at (0.21, 0.64) and (0.74, 0.27).\nfunction plate_modes(lx, ly, rh, dx, dy, dh, eta, tmax, count, tilt) local(i, j, m, n, best, bi, f0, amp)\n(\n  i = 0; m = 1;\n  loop(14, n = 1;\n    loop(14,\n      PLATE_TMP[i*3] = 0.5*$pi*sqrt((dx*(m/lx)^4 + 2*dh*(m*n/(lx*ly))^2 + dy*(n/ly)^4)/rh);\n      PLATE_TMP[i*3+1] = m; PLATE_TMP[i*3+2] = n; i += 1; n += 1;\n    );\n    m += 1;\n  );\n  f0 = 0;\n  loop(count,\n    best = 10^30; bi = -1; j = 0;\n    loop(196, PLATE_TMP[j*3] < best ? ( best = PLATE_TMP[j*3]; bi = j; ); j += 1;);\n    bi >= 0 ? (\n      m = PLATE_TMP[bi*3+1]; n = PLATE_TMP[bi*3+2]; PLATE_TMP[bi*3] = 10^31;\n      f0 == 0 ? f0 = best;\n      amp = sin(m*$pi*0.37)*sin(n*$pi*0.43)*(best/f0)^(-tilt);\n      mode_add(best, eta, tmax, amp, sin(m*$pi*0.21)*sin(n*$pi*0.64), sin(m*$pi*0.74)*sin(n*$pi*0.27));\n    );\n  );\n);\n\n// Modal density of a thin plate, modes per Hz: (S/2) sqrt(rho h / D).\n// It is independent of frequency, and it sets the FDN's total delay.\nfunction plate_density(s, rh, d) ( 0.5*s*sqrt(rh/d); );\n\n// Circular membrane with air loading: the air moving with a mode adds\n// roughly 2 rho_air / k of mass per unit area, which matters enormously for\n// something as light as cling film and a little for a drum skin.\n// f_mn = j_mn/(2 pi a) sqrt(T / (sigma + 2 rho_air a / j_mn))\nfunction membrane_modes(a, T, sigma, eta, tmax, count, tilt, radk) local(i, j, m, air, f, f0, amp, e)\n(\n  i = 0; f0 = 0;\n  loop(min(count, 24),\n    j = BESSEL_TAB[i*2]; m = BESSEL_TAB[i*2+1];\n    air = 2*RHO_AIR*a/j;\n    f = j/(2*$pi*a)*sqrt(T/(sigma + air));\n    f0 == 0 ? f0 = f;\n    e = eta + radk*air/(sigma + air);          // radiation damping follows air loading\n    amp = besj(m, j*0.30)*cos(m*0.8)*(f/f0)^(-tilt);\n    mode_add(f, e, tmax, amp, besj(m, j*0.55)*cos(m*0.2), besj(m, j*0.45)*cos(m*2.0));\n    m > 0 ? mode_add(f*1.002, e, tmax, besj(m, j*0.30)*sin(m*0.8)*(f/f0)^(-tilt),\n                     besj(m, j*0.55)*sin(m*0.2), besj(m, j*0.45)*sin(m*2.0));\n    i += 1;\n  );\n);\n\n// Cylindrical shell ring (bending) modes -- bottle walls, pipe walls, tubes:\n// f_n = (1/2pi) (h / (a^2 sqrt 12)) sqrt(E / (rho (1 - nu^2))) n (n^2 - 1) / sqrt(n^2 + 1)\n// Each n is a degenerate pair (cos/sin), split slightly, as in real bottles.\nfunction ring_modes(a, h, E, rho, nu, eta, tmax, nmax, amp) local(n, f, k)\n(\n  k = h/(a*a*sqrt(12))*sqrt(E/(rho*(1 - nu*nu)))/(2*$pi);\n  n = 2;\n  loop(nmax - 1,\n    f = k*n*(n*n - 1)/sqrt(n*n + 1);\n    mode_add(f, eta, tmax, amp/sqrt(n), cos(n*0.5), cos(n*2.2));\n    mode_add(f*1.004, eta, tmax, amp/sqrt(n), sin(n*0.5), sin(n*2.2));\n    n += 1;\n  );\n);\n\n// ---------------------------------------------------------------------------\n// Engine 3: dispersive feedback delay network (the dense diffuse field)\n// total: seconds of delay summed over the 8 lines = modal density (modes/Hz)\n// t60lo/t60hi at 200 Hz / 4 kHz; ratio: group delay at 200 Hz over 4 kHz;\n// spread: how unequal the line lengths are.\n// ---------------------------------------------------------------------------\nfunction fdn_setup(total, t60lo, t60hi, ratio, spread) local(i, fp, tot, sum, fb, wb, Tb, Ta, a, N, Pa, Pb, t60a, t60b, len, M)\n(\n  t60a = t60lo*tsc;\n  fdn_disp_t60 = t60a; fdn_disp_dens = total/fsc;    // for the GUI\n  // modal overlap: once modes overlap there is no point in a longer network,\n  // and the lines must stay short against the decay or it sounds like echoes\n  tot = min(total/fsc, 0.3*t60a); tot = max(0.004, min(3.0, tot));\n  fb = min(4000*fsc, 0.4*srate); wb = 2*$pi*fb/srate;\n  sum = 0; i = 0;\n  loop(8, FDN_TMP[i] = exp(spread*0.8*(i - 3.5)/3.5); sum += FDN_TMP[i]; i += 1;);\n  fp = FDN_BASE; i = 0; M = fdn_M;\n  fdn_on = 1;\n  loop(8,\n    Tb = tot*FDN_TMP[i]/sum; Ta = Tb*ratio;\n    dd_M = M; dd_K = 1; dd_wa = 2*$pi*200*fsc/srate; dd_wb = wb;\n    a = disp_solve((Ta - Tb)*srate);\n    N = floor(Tb*srate - M*gd1(wb, a) + 0.5) + i; N < 2 ? N = 2;\n    N = N | 1;                                  // odd, and distinct by construction\n    Pa = N + M*gd1(0, a); Pb = N + M*gd1(wb, a);\n    t60b = min(t60a, t60hi*tsc*bm);\n    op_fit(10^(-3*Pa/(t60a*srate)), 10^(-3*Pb/(t60b*srate)), wb);\n    do_alloc ? (\n      len = N + 8;\n      (pool_ptr + len < POOL_END && dpool + 2*M < DPOOL_END) ? (\n        fp[0] = pool_ptr; fp[1] = len; fp[2] = 0; fp[6] = 0; pool_ptr += len;\n        fp[9] = dpool; dpool += 2*M;\n      ) : fdn_on = 0;\n    ) : (\n      fdn_on = fdn_ok1;\n      N = min(N, fp[1] - 2);\n    );\n    fp[3] = N; fp[4] = op_b; fp[5] = op_p; fp[7] = M; fp[8] = a;\n    fp[10] = loop_energy(op_b, op_p);\n    fp += FDN_STRIDE; i += 1;\n  );\n);\n\n// ---------------------------------------------------------------------------\n// The materials. All dimensions in metres, moduli in Pa, densities in kg/m^3.\n// ---------------------------------------------------------------------------\nfunction setup_material() local(i, D, rh, q, f, L, dia, B, note, fn, S, dist, Dx, Dy, lam, mm, a, h, p, al)\n(\n  n_wg = 0; n_modes = 0; fdn_on = 0; curv_fr = 0; fdn_M = 4;\n  x_wg = x_mod = x_fdn = 0; wg_mod = wg_fdn = mod_fdn = 0;\n  o_wg = o_mod = o_fdn = 0;\n  rat_amt = rat_wg = rat_fdn = rat_mod = rat_to_mod = rat_to_out = 0; rat_hp = 1000; rat_ref = 1;\n  crk_amt = crk_to_fdn = crk_to_mod = crk_to_out = 0;\n  shim_amt = 0; glide_amt = 0;\n  in_hp = 30; in_lp = 16000; wg_lp = 0; fdn_hp = 20;\n  out_hp = 20; out_lp = 20000; trim = 0;\n\n  mat == 0 ? (\n    // CHAIN LINK FENCE. Two 4 mm line wires tensioned to 1.5 kN between\n    // posts: stiff enough (B ~ 2e-3) that anything above ~700 Hz outruns\n    // the rest -- the \"pew\". The mesh links are 2.5 mm wire between knuckles,\n    // clamped-clamped beams (partials 1 : 2.757 : 5.404), and they are set\n    // ringing mostly by rattling against each other.\n    wire_add(3.0, 0.004, 1500, 7850, 200*10^9, 0.0015, 4, 48, KCH, 1, 0.95, 0.35);\n    wire_add(3.4, 0.004, 1500, 7850, 200*10^9, 0.0015, 4, 48, KCH, 1, 0.35, 0.95);\n    i = 0;\n    loop(8,\n      L = 0.055 + 0.03*i/7;\n      f = 22.373/(2*$pi*L*L)*sqrt(200*10^9*0.0025^2/(16*7850));\n      mode_add(f,       0.012, 0.5, 1,    sin(i*2.4 + 0.3), cos(i*1.7 + 0.5));\n      mode_add(f*2.757, 0.012, 0.5, 0.6,  sin(i*1.3 + 1.1), cos(i*2.9 + 0.2));\n      mode_add(f*5.404, 0.012, 0.5, 0.35, sin(i*3.1 + 0.7), cos(i*0.9 + 1.3));\n      i += 1;\n    );\n    fdn_setup(0.04, t60e(200, 0.003, 1.2), t60e(4000, 0.003, 1.2), 3, 1);\n    x_wg = 1; x_mod = 0.3; x_fdn = 1; wg_fdn = 0.3;\n    o_wg = 0.55; o_mod = 0.2; o_fdn = 0.25;\n    rat_amt = 1; rat_wg = 1; rat_fdn = 0.5; rat_to_mod = 1; rat_to_out = 0.5; rat_hp = 1500; rat_ref = 1.2;\n    wg_lp = 9000;\n    trim = trim_tab[0];\n  );\n\n  mat == 1 ? (\n    // ICE SHEET. 5 cm of lake ice. Flexural waves: group velocity\n    // c_g = 2 (D / rho h)^(1/4) sqrt(omega), so over 35-48 m to the shore and\n    // back the highs arrive first and the lows trail -- the famous \"pew\".\n    D = 9*10^9*0.05^3/(12*(1 - 0.33^2)); q = (D/(917*0.05))^0.25;\n    dist = 70;\n    chirp_add(250, dist/(2*q*sqrt(2*$pi*250)), 4000, dist/(2*q*sqrt(2*$pi*4000)),\n              t60e(250, 0.001, 1.8), t60e(4000, 0.001, 1.8), 96, 1, 1, 0.15);\n    dist = 96;\n    chirp_add(250, dist/(2*q*sqrt(2*$pi*250)), 4000, dist/(2*q*sqrt(2*$pi*4000)),\n              t60e(250, 0.001, 1.8), t60e(4000, 0.001, 1.8), 96, 1, 0.15, 1);\n    fdn_setup(0.25, t60e(200, 0.004, 2.5), t60e(4000, 0.004, 2.5), 4, 1);\n    x_wg = 1; x_fdn = 1; wg_fdn = 0.25;\n    o_wg = 0.7; o_fdn = 0.3;\n    wg_lp = 4500; out_lp = 9000; in_hp = 60;\n    trim = trim_tab[1];\n  );\n\n  mat == 2 ? (\n    // TENSION WIRE. 2.5 mm steel guy wires, 25 m and 31 m, at 2 kN\n    // (f0 ~ 4 Hz). Tension dominates below a few kHz; above that the wire's\n    // bending stiffness takes over and the highs race ahead. Steel wire loses\n    // very little, so it drones.\n    wire_add(25, 0.0025, 2000, 7850, 200*10^9, 0.0004, 15, 96, KCH, 1, 1, 0.2);\n    wire_add(31, 0.0025, 2000, 7850, 200*10^9, 0.0004, 15, 96, KCH, 1, 0.2, 1);\n    fdn_setup(0.03, t60e(200, 0.002, 2), t60e(4000, 0.002, 2), 2, 1);\n    x_wg = 1; x_fdn = 0.5; wg_fdn = 0.15;\n    o_wg = 0.85; o_fdn = 0.15;\n    wg_lp = 9000;\n    trim = trim_tab[2];\n  );\n\n  mat == 3 ? (\n    // GONG (tam-tam). 80 cm bronze, 3 mm. Free circular-plate modes,\n    // f = lambda^2 / (2 pi a^2) sqrt(D / rho h), lambda^2 from Leissa (nu ~ 0.33).\n    // The low modes boom; the dense field above is the FDN, and the\n    // quadratic coupling between them is the tam-tam's delayed shimmer.\n    a = 0.4; h = 0.003;\n    D = 110*10^9*h^3/(12*(1 - 0.34^2)); rh = 8600*h;\n    q = sqrt(D/rh)/(2*$pi*a*a);\n    i = 0;\n    loop(12,\n      lam = i==0?5.253:i==1?9.084:i==2?12.23:i==3?20.52:i==4?21.6:i==5?33.06:i==6?35.25:i==7?38.55:i==8?46.2:i==9?52.91:i==10?59.86:61.0;\n      mm  = i==0?2:i==1?0:i==2?3:i==3?1:i==4?4:i==5?5:i==6?2:i==7?0:i==8?6:i==9?3:i==10?1:7;\n      mode_add(q*lam, 0.0004, 40, cos(mm*1.1)/sqrt(1 + i), cos(mm*0.4), cos(mm*2.1));\n      mm > 0 ? mode_add(q*lam*1.003, 0.0004, 40, sin(mm*1.1)/sqrt(1 + i), sin(mm*0.4), sin(mm*2.1));\n      i += 1;\n    );\n    fdn_setup(plate_density($pi*a*a, rh, D), t60e(200, 0.0004, 40), t60e(4000, 0.0004, 40), 4, 1);\n    x_mod = 1; x_fdn = 1; mod_fdn = 0.2;\n    o_mod = 0.3; o_fdn = 0.7;\n    shim_amt = 1; glide_amt = 0.3;\n    trim = trim_tab[3];\n  );\n\n  mat == 4 ? (\n    // PVC PIPE. 1.5 m of 2\" pipe (52 mm bore), open at both ends. The air\n    // column uses Trombolese's boundary-layer loss and end correction; the\n    // plastic wall adds a few dull, heavily damped ring modes.\n    tube_add(1.5,  0.026, 2, 1, 1, 1, 0.25);\n    tube_add(1.62, 0.026, 2, 1, 1, 0.25, 1);\n    ring_modes(0.03, 0.0035, 3*10^9, 1400, 0.4, 0.03, 0.5, 5, 0.5);\n    x_wg = 1; x_mod = 1;\n    o_wg = 0.8; o_mod = 0.2;\n    trim = trim_tab[4];\n  );\n\n  mat == 5 ? (\n    // GLASS. A free 800 x 600 x 5 mm pane of soda-lime glass: stiff, light,\n    // and very low loss (eta ~ 8e-4), so it rings long and bright.\n    D = 70*10^9*0.005^3/(12*(1 - 0.22^2)); rh = 2500*0.005;\n    plate_modes(0.8, 0.6, rh, D, D, D, 0.0008, 6, 32, 0.3);\n    fdn_setup(plate_density(0.48, rh, D), t60e(200, 0.0008, 6), t60e(4000, 0.0008, 6), 4.5, 1);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.4; o_fdn = 0.6;\n    in_hp = 120;\n    trim = trim_tab[5];\n  );\n\n  mat == 6 ? (\n    // MARBLE. A 1 m x 60 cm x 2 cm slab. Thick and stiff, so its modes start\n    // high and sit far apart: a short, stony, pitched clink.\n    D = 55*10^9*0.02^3/(12*(1 - 0.26^2)); rh = 2700*0.02;\n    plate_modes(1.0, 0.6, rh, D, D, D, 0.003, 2.5, 32, 0.3);\n    fdn_setup(plate_density(0.6, rh, D), t60e(200, 0.003, 2.5), t60e(4000, 0.003, 2.5), 3, 1);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.65; o_fdn = 0.35;\n    trim = trim_tab[6];\n  );\n\n  mat == 7 ? (\n    // CAR BODY PANEL. 0.8 mm steel door skin, 1.1 x 0.8 m, lightly damped\n    // by its seams and paint (eta ~ 0.003). Its curvature (radius ~2.5 m) stiffens\n    // everything below the ring frequency, ~340 Hz, so the low modes bunch\n    // up there: the \"bonk\".\n    D = 207*10^9*0.0008^3/(12*(1 - 0.29^2)); rh = 7850*0.0008;\n    curv_fr = 340;\n    plate_modes(1.1, 0.8, rh, D, D, D, 0.003, 2.5, 16, 0.4);\n    curv_fr = 0;\n    fdn_setup(plate_density(0.88, rh, D), t60e(200, 0.003, 2.5), t60e(4000, 0.003, 2.5), 4, 1);\n    fdn_hp = 340;\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.25; o_fdn = 0.75;\n    rat_amt = 0.4; rat_fdn = 1; rat_to_out = 0.6; rat_hp = 2500; rat_ref = 4;\n    trim = trim_tab[7];\n  );\n\n  mat == 8 ? (\n    // LEATHER. A 40 cm hide stretched like a frame drum: 1.2 mm, 1.08 kg/m^2,\n    // 1.5 kN/m. Leather's internal loss is enormous (eta ~ 0.06), so it is\n    // a thud, not a ring. Pitch sags as it decays (tension modulation).\n    membrane_modes(0.2, 1500, 1.08, 0.06, 0.8, 20, 0.5, 0.2);\n    fdn_setup(0.02, 0.25, 0.05, 1.5, 1);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.8; o_fdn = 0.2;\n    glide_amt = 0.5; out_lp = 6000;\n    trim = trim_tab[8];\n  );\n\n  mat == 9 ? (\n    // WINE BOTTLE. 750 ml. Its air is a Helmholtz resonator,\n    // f = c/2pi sqrt(A / (V L_eff)) ~ 110 Hz; the body adds longitudinal\n    // and cross modes, and the 4 mm glass wall rings on top.\n    a = 0.0095; S = $pi*a*a; L = 0.08 + 1.46*a;\n    mode_add(C_AIR/(2*$pi)*sqrt(S/(0.00075*L)), 1/35, 3, 1, 1, 1);\n    mode_add(C_AIR/(2*0.2),   1/60, 2, 0.25, 0.7, -0.4);\n    mode_add(2*C_AIR/(2*0.2), 1/60, 2, 0.15, -0.3, 0.8);\n    mode_add(1.8412*C_AIR/(2*$pi*0.037), 1/80, 2, 0.15, 0.6, 0.5);\n    ring_modes(0.037, 0.004, 70*10^9, 2500, 0.22, 0.0008, 3, 6, 0.5);\n    fdn_setup(0.006, t60e(200, 0.0008, 2), t60e(4000, 0.0008, 2), 3, 1);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.85; o_fdn = 0.15;\n    trim = trim_tab[9];\n  );\n\n  mat == 10 ? (\n    // PIANO STRING. Sustain pedal down: 24 strings, C2 to B3, free to ring\n    // in sympathy. Lengths and gauges follow a real scale; inharmonicity\n    // B = pi^3 E d^4 / (64 T L^2) comes out at 1e-4 to 3e-4, as measured on\n    // real pianos. The spruce soundboard is the diffuse part.\n    i = 0;\n    loop(24,\n      note = 36 + i; fn = 440*2^((note - 69)/12);\n      L = min(1.9, 0.62*2^((60 - note)*0.85/12));\n      dia = note < 48 ? 0.0012 : 0.001;\n      B = $pi^3*200*10^9*dia^4/(64*800*L*L);\n      string_add(fn/sqrt(1 + B), B, 0.00012, 18, 4, 1, 1, 0.5 + 0.45*sin(i*2.4), 0.5 - 0.45*sin(i*2.4));\n      i += 1;\n    );\n    D = 11*10^9*0.009^3/(12*(1 - 0.3^2)); rh = 440*0.009;\n    fdn_setup(plate_density(1.8, rh, D), t60e(200, 0.012, 1.2), t60e(4000, 0.012, 1.2), 3, 1);\n    x_wg = 1; x_fdn = 0.5; wg_fdn = 0.35;\n    o_wg = 0.75; o_fdn = 0.25;\n    trim = trim_tab[10];\n  );\n\n  mat == 11 ? (\n    // GUITAR STRING. Six steel strings in standard tuning on a 648 mm scale,\n    // ringing in sympathy and radiating through a spruce top whose first\n    // modes (air ~98 Hz, top ~204 Hz ...) colour everything.\n    i = 0;\n    loop(6,\n      note = i==0?40:i==1?45:i==2?50:i==3?55:i==4?59:64;\n      dia = i==0?0.00046:i==1?0.00043:i==2?0.0004:i==3?0.00043:i==4?0.00033:0.00025;\n      fn = 440*2^((note - 69)/12);\n      B = $pi^3*200*10^9*dia^4/(64*110*0.648*0.648);\n      string_add(fn/sqrt(1 + B), B, 0.0003, 6, 3, 1, 1, 0.5 + 0.4*(i - 2.5)/2.5, 0.5 - 0.4*(i - 2.5)/2.5);\n      i += 1;\n    );\n    i = 0;\n    loop(12,\n      f = i==0?98:i==1?204:i==2?226:i==3?381:i==4?437:i==5?552:i==6?650:i==7?780:i==8?920:i==9?1100:i==10?1450:2000;\n      q = i==0?20:i==1?30:i==2?25:i==3?30:i==4?35:i==5?35:i==6?40:i==7?40:i==8?40:i==9?45:i==10?40:35;\n      mode_add(f, 1/q, 1, 1/sqrt(1 + i), sin(i*2.1 + 0.4), cos(i*1.3 + 0.9));\n      i += 1;\n    );\n    fdn_setup(0.04, 0.5, 0.15, 2, 1);\n    x_wg = 1; x_mod = 0.4; x_fdn = 0.3; wg_mod = 0.6; wg_fdn = 0.1;\n    o_wg = 0.45; o_mod = 0.45; o_fdn = 0.1;\n    trim = trim_tab[11];\n  );\n\n  mat == 12 ? (\n    // VIOLIN STRING. G D A E on a 328 mm string length. The strings are\n    // heard mostly through the body: the air mode A0 (~275 Hz), the\n    // corpus modes (405-550 Hz) and the \"bridge hill\" around 2.5 kHz.\n    i = 0;\n    loop(4,\n      note = i==0?55:i==1?62:i==2?69:76;\n      fn = 440*2^((note - 69)/12);\n      B = i==0?0.00018:i==1?0.00011:i==2?0.00007:0.000055;\n      string_add(fn/sqrt(1 + B), B, 0.0015, 3, 3, 1, 1, 0.5 + 0.35*(i - 1.5)/1.5, 0.5 - 0.35*(i - 1.5)/1.5);\n      i += 1;\n    );\n    i = 0;\n    loop(12,\n      f = i==0?275:i==1?405:i==2?460:i==3?550:i==4?700:i==5?850:i==6?1000:i==7?1300:i==8?2100:i==9?2450:i==10?2800:3300;\n      q = i==0?18:i==1?25:i==2?30:i==3?30:i==4?30:i==5?30:i==6?35:i==7?35:i==8?20:i==9?18:i==10?18:20;\n      mode_add(f, 1/q, 1, (i >= 8 ? 0.7 : 1/sqrt(1 + 0.5*i)), sin(i*2.1 + 0.4), cos(i*1.3 + 0.9));\n      i += 1;\n    );\n    fdn_setup(0.025, 0.4, 0.1, 2, 1);\n    x_wg = 1; x_mod = 0.3; x_fdn = 0.2; wg_mod = 0.8; wg_fdn = 0.1;\n    o_wg = 0.25; o_mod = 0.65; o_fdn = 0.1;\n    trim = trim_tab[12];\n  );\n\n  mat == 13 ? (\n    // STEEL HANDPAN. D Kurd (D3 A3 Bb3 C4 D4 E4 F4 G4 A4). Each hammered\n    // tone field is tuned to fundamental, octave and compound fifth\n    // (1 : 2 : 3). The shell's port makes a Helmholtz \"Gu\" near 85 Hz.\n    i = 0;\n    loop(9,\n      note = i==0?50:i==1?57:i==2?58:i==3?60:i==4?62:i==5?64:i==6?65:i==7?67:69;\n      fn = 440*2^((note - 69)/12);\n      mode_add(fn,   0.0022, 8, 1,    cos(i*0.7), sin(i*0.7 + 0.5));\n      mode_add(2*fn, 0.0028, 8, 0.55, cos(i*0.7 + 0.3), sin(i*0.7 + 0.9));\n      mode_add(3*fn, 0.0035, 8, 0.35, cos(i*0.7 + 0.6), sin(i*0.7 + 1.3));\n      i += 1;\n    );\n    mode_add(85, 1/12, 2, 0.8, 0.8, 0.8);\n    D = 207*10^9*0.0012^3/(12*(1 - 0.29^2)); rh = 7850*0.0012;\n    fdn_setup(plate_density(0.44, rh, D), t60e(200, 0.003, 3), t60e(4000, 0.003, 3), 3, 1);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.75; o_fdn = 0.25;\n    shim_amt = 0.3;\n    trim = trim_tab[13];\n  );\n\n  mat == 14 ? (\n    // TOILET ROLL TUBE. 10 cm of cardboard tube, 44 mm across, open both\n    // ends (f1 ~ 1.35 kHz). Cardboard is rough and porous, so the wall loss\n    // is several times a smooth pipe's, and its own ring modes are dead.\n    tube_add(0.10,  0.022,  2, 4, 1, 1, 0.3);\n    tube_add(0.104, 0.0225, 2, 4, 1, 0.3, 1);\n    ring_modes(0.0225, 0.0015, 3*10^9, 700, 0.3, 0.06, 0.3, 5, 0.6);\n    x_wg = 1; x_mod = 1;\n    o_wg = 0.75; o_mod = 0.25;\n    trim = trim_tab[14];\n  );\n\n  mat == 15 ? (\n    // ALUMINIUM FOIL. A 30 x 45 cm sheet, 16 microns. At that thickness the\n    // modal density is enormous, (S/2) sqrt(rho h / D) ~ 2.7 modes/Hz, but the\n    // crumples rub and the damping is so high the modes overlap into a\n    // sizzle. Loud input crinkles it: random crackle events.\n    D = 69*10^9*0.000016^3/(12*(1 - 0.33^2)); rh = 2700*0.000016;\n    fdn_setup(plate_density(0.135, rh, D), 0.35, 0.12, 5, 1);\n    i = 0;\n    loop(12,\n      mode_add(1500*1.19^i, 0.02, 0.2, 0.6, sin(i*2.3 + 0.2), cos(i*1.9 + 0.7));\n      i += 1;\n    );\n    x_fdn = 1; x_mod = 0.5;\n    o_fdn = 0.75; o_mod = 0.25;\n    crk_amt = 1; crk_to_fdn = 1; crk_to_mod = 0.5; crk_to_out = 0.3;\n    rat_amt = 0.3; rat_fdn = 1; rat_to_out = 0.5; rat_hp = 3000;\n    in_hp = 200; out_hp = 250;\n    trim = trim_tab[15];\n  );\n\n  mat == 16 ? (\n    // CLING FILM. 12 micron polyethylene stretched over a 30 cm bowl. It is\n    // so light (11 g/m^2) that the air it drags along outweighs it ~14 times:\n    // the modes drop to ~25 Hz and radiate their energy away at once. Loud\n    // input makes it slap the rim and buzz, like a kazoo.\n    membrane_modes(0.15, 15, 0.011, 0.12, 0.4, 20, 0.3, 0.3);\n    fdn_setup(0.03, 0.2, 0.08, 2, 1);\n    x_mod = 1; x_fdn = 0.6;\n    o_mod = 0.7; o_fdn = 0.3;\n    glide_amt = 1;\n    rat_amt = 1; rat_mod = 1; rat_to_out = 0.8; rat_hp = 400; rat_ref = 0.35;\n    trim = trim_tab[16];\n  );\n\n  mat == 17 ? (\n    // CORRUGATED TIN ROOF. 0.5 mm galvanised steel with 18 mm corrugations,\n    // screwed to purlins every 0.9 m. The ribs make it ~1800 times stiffer\n    // along them than across (Dx = E h d^2 / 8), an orthotropic plate; the\n    // loose fixings rattle.\n    h = 0.0005;\n    Dy = 207*10^9*h^3/(12*(1 - 0.3^2)); Dx = 207*10^9*h*0.018^2/8; rh = 7850*h;\n    plate_modes(0.9, 0.8, rh, Dx, Dy, Dy, 0.004, 2.5, 28, 0.2);\n    fdn_setup(0.5*5.8*sqrt(rh)/(Dx*Dy)^0.25, t60e(200, 0.004, 2.5), t60e(4000, 0.004, 2.5), 3, 1.6);\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.35; o_fdn = 0.65;\n    rat_amt = 1; rat_fdn = 1; rat_mod = 0.5; rat_to_out = 0.7; rat_hp = 1800; rat_ref = 1.4;\n    trim = trim_tab[17];\n  );\n\n  mat == 18 ? (\n    // METAL BARREL. A 205 litre steel drum (572 mm x 851 mm, 1.2 mm wall).\n    // The air inside is a closed cylinder,\n    // f = (c/2) sqrt((p/H)^2 + (alpha_mn / (pi a))^2); the lids are clamped\n    // circular plates; the shell is the dense metallic field.\n    a = 0.286; h = 0.851;\n    i = 0;\n    loop(40,\n      p = i % 5; mm = floor(i/5);\n      al = mm==0?0:mm==1?1.8412:mm==2?3.0542:mm==3?3.8317:mm==4?4.2012:mm==5?5.3176:mm==6?5.3314:6.4156;\n      f = 0.5*C_AIR*sqrt((p/h)^2 + (al/($pi*a))^2);\n      (f > 0 && f < 900) ? mode_add(f, 1/60, 3, 0.8/sqrt(1 + 0.3*i), cos(p*1.3 + mm*0.7), cos(p*0.4 + mm*2.2));\n      i += 1;\n    );\n    D = 207*10^9*0.0024^3/(12*(1 - 0.29^2)); rh = 7850*0.0012;\n    q = sqrt(D/rh)/(2*$pi*a*a);\n    i = 0;\n    loop(8,\n      lam = i==0?10.216:i==1?21.26:i==2?34.88:i==3?39.77:i==4?51.04:i==5?60.83:i==6?69.67:84.58;\n      mode_add(q*lam,      0.002, 3, 0.6/sqrt(1 + i), sin(i*1.7 + 0.3), cos(i*1.1 + 0.2));\n      mode_add(q*lam*0.98, 0.002, 3, 0.6/sqrt(1 + i), cos(i*2.3 + 0.1), sin(i*0.8 + 0.6));\n      i += 1;\n    );\n    D = 207*10^9*0.0012^3/(12*(1 - 0.29^2));\n    fdn_setup(plate_density(2*$pi*a*h, rh, D), t60e(200, 0.0015, 4), t60e(4000, 0.0015, 4), 3, 1);\n    fdn_hp = 120;\n    x_mod = 1; x_fdn = 1;\n    o_mod = 0.55; o_fdn = 0.45;\n    shim_amt = 0.3;\n    trim = trim_tab[18];\n  );\n\n  mat == 19 ? (\n    // BONE. A dried human shin bone (tibia), 36 cm, intact. The shaft is a\n    // tube of cortical bone (E = 18 GPa, rho = 1900, as in Wind-Instrument-\n    // Creator; 23 mm across with 5 mm walls). As a plain tube it would bend\n    // at 559 Hz, but the heavy knobbly ends (each ~0.35 x the shaft's mass)\n    // pull every mode down: a finite-element model of the tube with end\n    // masses puts the first at 340 Hz, inside the 240-405 Hz measured on real\n    // tibiae. The cross-section is not round, so each bending mode has a\n    // stiffer twin ~1.28 x higher (measured: a second peak at 400-500 Hz).\n    // Twisting and stretching add modes; the sealed marrow cavity is a\n    // closed air column with a rough bone wall. Driven hard, two bones knock\n    // together: the clack of \"rhythm bones\". Dry bone is lossy (eta ~ 0.02).\n    L = 0.36; a = 0.0115; h = 0.0065;                    // length, outer, inner radius\n    f = 22.373/(2*$pi*L*L)*sqrt(18*10^9/1900)*sqrt((a*a + h*h)/4);   // plain-tube bending f1\n    i = 0;\n    loop(6,\n      // finite-element frequencies of the heavy-ended tube / plain-tube f1\n      q = i==0?0.60938:i==1?1.96688:i==2?4.18833:i==3?7.28482:i==4?11.2601:16.1160;\n      mode_add(f*q,      0.02, 2.5, 1/sqrt(1 + i),   sin(i*1.9 + 0.4), cos(i*1.3 + 0.2));\n      mode_add(f*q*1.28, 0.02, 2.5, 0.8/sqrt(1 + i), cos(i*2.2 + 0.7), sin(i*0.9 + 0.5));\n      i += 1;\n    );\n    q = sqrt(18*10^9/(2*1.3*1900))/(2*L);               // plain torsion f1, c_T / 2L\n    mode_add(q*0.32034, 0.02, 2.5, 0.35, 0.6, -0.5);    // heavy ends' polar inertia lowers it\n    mode_add(q*1.10109, 0.02, 2.5, 0.25, -0.4, 0.7);\n    q = sqrt(18*10^9/1900)/(2*L);                        // plain longitudinal f1, c / 2L\n    mode_add(q*0.61938, 0.02, 2.5, 0.25, 0.5, 0.5);\n    mode_add(q*1.37255, 0.02, 2.5, 0.18, -0.5, 0.4);\n    tube_add(0.26, 0.0065, 0, 1.6, 1, 0.7, 0.7);         // sealed marrow cavity\n    D = 18*10^9*0.005^3/(12*(1 - 0.3^2));\n    fdn_setup(plate_density(2*$pi*0.009*L, 1900*0.005, D), t60e(200, 0.02, 2.5), t60e(4000, 0.02, 2.5), 2, 1);\n    x_mod = 1; x_wg = 1; x_fdn = 1;\n    o_mod = 0.65; o_wg = 0.2; o_fdn = 0.15;\n    rat_amt = 1; rat_mod = 1; rat_to_out = 0.7; rat_hp = 1200; rat_ref = 0.7;\n    in_hp = 60;\n    trim = trim_tab[19];\n  );\n);\n\n// ---------------------------------------------------------------------------\n// Normalisation: each engine is scaled to unit impulse-response energy, so\n// the per-material weights are real power proportions and materials with\n// wildly different decay times land at comparable levels.\n// ---------------------------------------------------------------------------\nfunction engine_norms() local(p, e, i)\n(\n  e = 0; p = WG_BASE;\n  loop(n_wg, e += p[14]*p[14]*0.5*(p[15]*p[15] + p[16]*p[16])*p[17]; p += WG_STRIDE;);\n  wg_norm = e > 0 ? 1/sqrt(e) : 0;\n  e = 0; p = MOD_BASE;\n  loop(n_modes, e += 0.5*(p[7]*p[7] + p[8]*p[8])/(2*max(0.000000001, 1 - p[9]*p[9])); p += MOD_STRIDE;);\n  mod_norm = e > 0 ? 1/sqrt(e) : 0;\n  e = 0; p = FDN_BASE; i = 0;\n  loop(8, e += p[10]; p += FDN_STRIDE; i += 1;);\n  e *= FDN_E_CAL/64;\n  fdn_norm = (fdn_on && e > 0) ? 1/sqrt(e) : 0;\n);\n\n// Per-material loudness trims (dB), measured with tools/check.py.\ntrim_tab = 3200;\ni = 0;\nloop(20, trim_tab[i] = 0; i += 1;);\ntrim_tab[0] = 0.4; trim_tab[1] = 2.1; trim_tab[2] = -4.7; trim_tab[3] = -6.0; trim_tab[4] = -10.3;\ntrim_tab[5] = -6.1; trim_tab[6] = -2.1; trim_tab[7] = 2.6; trim_tab[8] = -15.6; trim_tab[9] = -17.1;\ntrim_tab[10] = -2.9; trim_tab[11] = -5.2; trim_tab[12] = -5.7; trim_tab[13] = -5.3; trim_tab[14] = -14.0;\ntrim_tab[15] = 3.0; trim_tab[16] = -4.7; trim_tab[17] = -7.6; trim_tab[18] = -11.8; trim_tab[19] = 1.5;\ndisp_lim = -0.9;\nFDN_E_CAL = 0.65;          // measured: mixing makes the lines' outputs partly coherent\n\nfunction lp1(fc) ( 1 - exp(-2*$pi*min(fc, 0.49*srate)/srate); );\nfunction hp1(fc) ( exp(-2*$pi*fc/srate); );\n\n// RBJ biquad coefficients into a 5-slot block: b0 b1 b2 a1 a2\nfunction bq_lp(o, fc, q) local(w, al, cw, a0)\n(\n  w = 2*$pi*min(fc, 0.45*srate)/srate; al = sin(w)/(2*q); cw = cos(w); a0 = 1 + al;\n  o[0] = (1 - cw)/2/a0; o[1] = (1 - cw)/a0; o[2] = (1 - cw)/2/a0; o[3] = -2*cw/a0; o[4] = (1 - al)/a0;\n);\nfunction bq_hp(o, fc, q) local(w, al, cw, a0)\n(\n  w = 2*$pi*min(fc, 0.45*srate)/srate; al = sin(w)/(2*q); cw = cos(w); a0 = 1 + al;\n  o[0] = (1 + cw)/2/a0; o[1] = -(1 + cw)/a0; o[2] = (1 + cw)/2/a0; o[3] = -2*cw/a0; o[4] = (1 - al)/a0;\n);\nBIQ = 3300;   // coefficient blocks: 0 wg lp, 5 user lowcut, 10 user highcut\n\nfunction rebuild(alloc) local(dm)\n(\n  mat = slider1 | 0;\n  size_ = slider3/100;\n  fsc = 2^(slider6/12)/size_;\n  KCH = max(1, floor(srate/24000 + 0.5));\n\n  // pass 1: default decay and brightness, allocating if the geometry changed\n  do_alloc = alloc; alloc_full = 0;\n  alloc ? ( pool_ptr = pool_base; dpool = DPOOL0; );\n  tsc = size_; bm = 1;\n  setup_material();\n  wg_cnt1 = n_wg; mod_cnt1 = n_modes; fdn_ok1 = fdn_on;\n  alloc ? (\n    pool_hi = max(pool_hi, pool_ptr);\n    memset(pool_base, 0, pool_hi - pool_base);\n    memset(DPOOL0, 0, DPOOL_END - DPOOL0);\n    pool_hi = pool_ptr;\n    memset(FDN_TMP, 0, 8);\n  );\n  engine_norms();\n\n  // pass 2: the user's decay and brightness, keeping the normalisation\n  dm = slider4/100;\n  (dm != 1 || slider5 != 0) ? (\n    do_alloc = 0; tsc = size_*dm; bm = 2^(slider5/50);\n    setup_material();\n  );\n\n  ihp_c = hp1(in_hp); ilp_c = lp1(in_lp);\n  fhp_c = hp1(fdn_hp);\n  ohp_c = hp1(out_hp); olp_c = out_lp >= 20000 ? 1 : lp1(out_lp);\n  rat_c = hp1(rat_hp);\n  wg_lp > 0 ? bq_lp(BIQ, wg_lp, 0.707);\n  trim_g = 10^(trim/20);\n  env_rel = exp(-1/(0.05*srate));\n);\n\nfunction update_io()\n(\n  mix_t = slider2/100;\n  wet_t = min(1, 2*mix_t); dry_t = min(1, 2*(1 - mix_t));\n  outg_t = 10^(slider12/20);\n  wid_t = slider9/100;\n  pd_n = floor(slider7*0.001*srate);\n  drive = slider8/100;\n  rat_g = rat_amt*rat_ref*(0.3 + 12*drive + 30*drive*drive);\n  rat_og = 1/sqrt(1 + 0.5*rat_g);\n  crk_rate = crk_amt*(0.2 + 2*drive)*1500/srate;\n  shim_g = shim_amt*1.2*drive*drive;\n  glide_k = 0.08*glide_amt*(0.2 + drive);\n  bq_hp(BIQ + 5, slider10, 0.707);\n  bq_lp(BIQ + 10, slider11, 0.707);\n  lc_on = slider10 > 20.5; hc_on = slider11 < 19999;\n);\n\n// Everything a parameter change needs. Called from @slider, and from @block\n// when the GUI has moved a slider (JSFX does not run @slider for those).\nfunction apply_params()\n(\n  ((slider1|0) != last_mat || slider3 != last_size || slider6 != last_tune) ? (\n    rebuild(1);\n  ) : (\n    (slider4 != last_decay || slider5 != last_bright) ? rebuild(0);\n  );\n  last_mat = slider1|0; last_size = slider3; last_tune = slider6;\n  last_decay = slider4; last_bright = slider5;\n  update_io();\n  mix_s < 0 ? ( wet_s = wet_t; dry_s = dry_t; outg_s = outg_t; wid_s = wid_t; mix_s = 0; );\n);\n\n// ---------------------------------------------------------------------------\n// GUI tables. @gfx runs in its own thread but shares every global variable\n// with the audio code, so everything it touches is prefixed ui_ and it calls\n// only ui_ functions, which touch only ui_ globals. (Function locals are kept\n// per code section, so those are not shared.)\n// ---------------------------------------------------------------------------\nUI_KNOBS = 3400;   // 11 knobs x 6: slider, min, max, log?, default, step\nfunction ui_knob(i, sl, lo, hi, lg, def, st)\n( UI_KNOBS[i*6] = sl; UI_KNOBS[i*6+1] = lo; UI_KNOBS[i*6+2] = hi;\n  UI_KNOBS[i*6+3] = lg; UI_KNOBS[i*6+4] = def; UI_KNOBS[i*6+5] = st; );\nui_knob(0,  2,     0,   100, 0,    35, 0.1);   // Mix\nui_knob(1,  3,    25,   400, 1,   100, 1);     // Size\nui_knob(2,  4,    10,   400, 1,   100, 1);     // Decay\nui_knob(3,  5,  -100,   100, 0,     0, 1);     // Brightness\nui_knob(4,  6,   -12,    12, 0,     0, 0.1);   // Tuning\nui_knob(5,  7,     0,   250, 0,     0, 1);     // Pre-delay\nui_knob(6,  8,     0,   100, 0,    30, 1);     // Drive\nui_knob(7,  9,     0,   150, 0,   100, 1);     // Width\nui_knob(8,  10,   20,  1000, 1,    20, 1);     // Low cut\nui_knob(9,  11, 1000, 20000, 1, 20000, 10);    // High cut\nui_knob(10, 12,  -24,    12, 0,     0, 0.1);   // Output\n\n// string slots: 100+ material names, 150+ what each sounds like, 300+ knob labels\nstrcpy(100, \"Chain Link Fence\");    strcpy(150, \"Metallic twang, laser \u00e2\u0080\u009cpew\u00e2\u0080\u009d and jangling links\");\nstrcpy(101, \"Ice Sheet\");           strcpy(151, \"Falling \u00e2\u0080\u009cpew pew\u00e2\u0080\u009d echoes off a frozen lake\");\nstrcpy(102, \"Tension Wire\");        strcpy(152, \"Long droning sci-fi blaster chirps\");\nstrcpy(103, \"Gong\");                strcpy(153, \"A huge, dark, shimmering tam-tam wash\");\nstrcpy(104, \"PVC Pipe\");            strcpy(154, \"Hollow, tubey flutter down 1.5 m of pipe\");\nstrcpy(105, \"Glass\");               strcpy(155, \"Bright, glassy ring of a window pane\");\nstrcpy(106, \"Marble\");              strcpy(156, \"A short, stony, pitched clink\");\nstrcpy(107, \"Car Body Panel\");      strcpy(157, \"The clanky metallic bonk of a door skin\");\nstrcpy(108, \"Leather\");             strcpy(158, \"A dead, thumpy drum-skin thud\");\nstrcpy(109, \"Wine Bottle\");         strcpy(159, \"A hooty 110 Hz boom with a glass clink\");\nstrcpy(110, \"Piano String\");        strcpy(160, \"The halo of 24 piano strings, pedal down\");\nstrcpy(111, \"Guitar String\");       strcpy(161, \"Six open strings humming through the body\");\nstrcpy(112, \"Violin String\");       strcpy(162, \"Nasal, woody violin-body resonance\");\nstrcpy(113, \"Steel Handpan\");       strcpy(163, \"A sweet, bell-like bloom in D minor\");\nstrcpy(114, \"Toilet Roll Tube\");    strcpy(164, \"Honky and boxy, like talking through a tube\");\nstrcpy(115, \"Aluminium Foil\");      strcpy(165, \"A sizzly, crinkly, papery splash\");\nstrcpy(116, \"Cling Film\");          strcpy(166, \"A soft, rubbery, kazoo-like buzz\");\nstrcpy(117, \"Corrugated Tin Roof\"); strcpy(167, \"Rumbling, rattly and tinny\");\nstrcpy(118, \"Metal Barrel\");        strcpy(168, \"The boom of an oil drum, with a steel ring\");\nstrcpy(119, \"Bone\");                strcpy(169, \"A dry, woody knock with a hollow, hooty core\");\nstrcpy(300, \"MIX\");     strcpy(301, \"SIZE\");      strcpy(302, \"DECAY\");    strcpy(303, \"BRIGHT\");\nstrcpy(304, \"TUNE\");    strcpy(305, \"PRE-DELAY\"); strcpy(306, \"DRIVE\");    strcpy(307, \"WIDTH\");\nstrcpy(308, \"LOW CUT\"); strcpy(309, \"HIGH CUT\");  strcpy(310, \"OUTPUT\");\n\nfunction ui_norm(k, v) local(lo, hi)\n(\n  lo = UI_KNOBS[k*6+1]; hi = UI_KNOBS[k*6+2];\n  max(0, min(1, UI_KNOBS[k*6+3] ? log(v/lo)/log(hi/lo) : (v - lo)/(hi - lo)));\n);\nfunction ui_denorm(k, n) local(lo, hi, st, v)\n(\n  lo = UI_KNOBS[k*6+1]; hi = UI_KNOBS[k*6+2]; st = UI_KNOBS[k*6+5];\n  n = max(0, min(1, n));\n  v = UI_KNOBS[k*6+3] ? lo*(hi/lo)^n : lo + n*(hi - lo);\n  max(lo, min(hi, floor(v/st + 0.5)*st));\n);\n// Move a slider from the GUI: tell REAPER (automation, undo) and ask @block\n// to apply it, since @slider does not run for GUI changes.\nfunction ui_setslider(sl, v)\n(\n  slider(sl) != v ? ( slider(sl) = v; slider_automate(2^(sl - 1)); ui_changed = 1; );\n);\n// End a touch-automation pass for this slider once the gesture is over.\nfunction ui_endtouch(sl) ( slider_automate(2^(sl - 1), 1); );\nfunction ui_value_str(k, v)\n(\n  k == 3 ? sprintf(#ui_val, \"%+d\", floor(v + 0.5)) :\n  k == 4 ? sprintf(#ui_val, \"%+.1f st\", v) :\n  k == 5 ? sprintf(#ui_val, \"%d ms\", floor(v + 0.5)) :\n  k == 8 ? (v <= 20.5 ? strcpy(#ui_val, \"Off\") : sprintf(#ui_val, \"%d Hz\", floor(v + 0.5))) :\n  k == 9 ? (v >= 19999 ? strcpy(#ui_val, \"Off\") : sprintf(#ui_val, \"%.1f kHz\", v/1000)) :\n  k == 10 ? sprintf(#ui_val, \"%+.1f dB\", v) :\n  sprintf(#ui_val, \"%d%%\", floor(v + 0.5));\n);\nfunction ui_rgb(r, g, b, a) ( gfx_r = r; gfx_g = g; gfx_b = b; gfx_a = a; );\n// frequency (Hz) -> x on the resonance plot; decay (s) -> 0..1 height\nfunction ui_fx(f) ( ui_px + ui_pw*max(0, min(1, log(f/20)/log(1000))); );\nfunction ui_th(t) ( max(0.04, min(1, log(max(t, 0.02)/0.02)/log(1500))); );\n// gfx_drawstr clips to (x, y, right, bottom); give non-centred text room for\n// descenders, since REAPER's fonts are taller than their nominal size\nfunction ui_text(str, x, y, w, h, flags)\n( gfx_x = x; gfx_y = y; gfx_drawstr(str, flags, x + w, y + h + ((flags & 4) ? 0 : gfx_texth)); );\nfunction ui_arc(x, y, r, a0, a1, th) local(rr)\n( rr = r - th/2; loop(max(1, ceil(th)), gfx_arc(x, y, rr, a0, a1, 1); rr += 1;); );\ngfx_ext_retina = 1;\nui_drag = -1; ui_click_k = -1;\n\n// pre-delay buffers sit at the bottom of the pool\npd_len = floor(0.26*srate) + 4;\npdL = POOL0; pdR = pdL + pd_len;\npool_base = pdR + pd_len;\nmemset(pdL, 0, 2*pd_len);\npd_w = 0;\npool_hi = pool_base;\nlast_mat = -1;\ncnt = 0; dn = 0.00000000000000000001;\nmix_s = -1;\n\n@slider\n\napply_params();\n\n@block\n\nsm = 1 - exp(-1/(0.02*srate));\nui_changed ? ( ui_changed = 0; apply_params(); );\nmtr_dec = exp(-1/(0.3*srate));\n\n@sample\n\nwet_s += (wet_t - wet_s)*sm; dry_s += (dry_t - dry_s)*sm;\noutg_s += (outg_t - outg_s)*sm; wid_s += (wid_t - wid_s)*sm;\n\ninL = spl0; inR = spl1;\n\n// ---- pre-delay\npdL[pd_w] = inL; pdR[pd_w] = inR;\nrp = pd_w - pd_n; rp < 0 ? rp += pd_len;\nxL = pdL[rp]; xR = pdR[rp];\npd_w += 1; pd_w >= pd_len ? pd_w = 0;\n\n// ---- the transducer driving the material: mono drive plus a side component\nxm = 0.5*(xL + xR); xs = 0.5*(xL - xR);\nih_y = ihp_c*(ih_y + xm - ih_x1); ih_x1 = xm;\nil_y += ilp_c*(ih_y - il_y);\nxb = il_y;\nis_y = ihp_c*(is_y + xs - is_x1); is_x1 = xs;\nxsb = is_y;\n\nab = abs(xb); env_in = ab > env_in ? ab : env_in*env_rel;\ndn = -dn;\ncnt += 1; cnt >= 720720 ? cnt = 0;\n\n// ---- crackle (foil): random crinkle events, more of them when driven hard\ncrk_amt > 0 ? (\n  crk = rand(1) < crk_rate*min(1, 4*env_in) ? (rand(2) - 1)*(0.2 + env_in) : 0;\n) : crk = 0;\n\n// ---- engine 1: waveguides\nwgL = wgR = 0;\nn_wg > 0 ? (\n  xw = xb*x_wg;\n  wg_lp > 0 ? (\n    q1 = BIQ[0]*xw + BIQ[1]*wq1x1 + BIQ[2]*wq1x2 - BIQ[3]*wq1y1 - BIQ[4]*wq1y2;\n    wq1x2 = wq1x1; wq1x1 = xw; wq1y2 = wq1y1; wq1y1 = q1;\n    q2 = BIQ[0]*q1 + BIQ[1]*wq2x1 + BIQ[2]*wq2x2 - BIQ[3]*wq2y1 - BIQ[4]*wq2y2;\n    wq2x2 = wq2x1; wq2x1 = q1; wq2y2 = wq2y1; wq2y1 = q2;\n    xw = q2;\n  );\n  xw += dn;\n  p = WG_BASE;\n  loop(n_wg,\n    buf = p[0]; len = p[1]; w = p[2];\n    r = w - p[3]; r < 0 ? r += len;\n    x = buf[r];\n    y = p[4]*(x - p[6]) + p[5]; p[5] = x; p[6] = y;     // Thiran fractional delay\n    y = p[7]*y + p[8]*p[9]; p[9] = y;                   // loss\n    M = p[10];\n    M > 0 ? (                                           // dispersion\n      a = p[11]; K = p[12]; s = p[13] + cnt % K; K2 = 2*K;\n      loop(M, xo = s[0]; yo = s[K]; z = a*(y - yo) + xo; s[0] = y; s[K] = z; y = z; s += K2;);\n    );\n    wgL += y*p[15]; wgR += y*p[16];\n    wpk = abs(y); p[20] = wpk > p[20] ? wpk : p[20]*0.9995;   // GUI glow\n    buf[w] = y + xw*p[14];\n    w += 1; w >= len ? w = 0; p[2] = w;\n    p += WG_STRIDE;\n  );\n  wgL *= wg_norm; wgR *= wg_norm;\n);\nwg_mono = 0.5*(wgL + wgR);\n\n// ---- engine 2: modes\nmL = mR = 0;\nn_modes > 0 ? (\n  din = xb*x_mod + wg_mono*wg_mod + rat*rat_og*rat_to_mod + crk*crk_to_mod + dn;\n  gd = glide_d;\n  p = MOD_BASE;\n  loop(n_modes,\n    y = (p[0] - gd*p[6])*p[2] - p[1]*p[3] + din;\n    p[3] = p[2]; p[2] = y;\n    mL += y*p[4]; mR += y*p[5];\n    p += MOD_STRIDE;\n  );\n  mL *= mod_norm; mR *= mod_norm;\n);\nmod_mono = 0.5*(mL + mR);\nglide_amt > 0 ? (\n  am = abs(mod_mono); env_b = am > env_b ? am : env_b*env_rel;\n  glide_d = min(0.06, glide_k*env_b);\n);\n\n// ---- tam-tam style shimmer: quadratic coupling from the strong modes\nshim_amt > 0 ? (\n  q = mod_mono*mod_mono*shim_g;\n  shim = 0.995*(shim + q - sq1); sq1 = q;\n);\n\n// ---- engine 3: dispersive FDN\nfL = fR = 0;\nfdn_on ? (\n  fin = xb*x_fdn + wg_mono*wg_fdn + mod_mono*mod_fdn + shim + crk*crk_to_fdn + dn;\n  fh_y = fhp_c*(fh_y + fin - fh_x1); fh_x1 = fin; fin = fh_y;\n  fsi = xsb*x_fdn;\n  fp = FDN_BASE; i = 0;\n  loop(8,\n    buf = fp[0]; r = fp[2] - fp[3]; r < 0 ? r += fp[1];\n    y = buf[r];\n    y = fp[4]*y + fp[5]*fp[6]; fp[6] = y;\n    M = fp[7];\n    M > 0 ? (\n      a = fp[8]; s = fp[9];\n      loop(M, xo = s[0]; yo = s[1]; z = a*(y - yo) + xo; s[0] = y; s[1] = z; y = z; s += 2;);\n    );\n    FDN_TMP[i] = y;\n    fp += FDN_STRIDE; i += 1;\n  );\n  h0 = FDN_TMP[0]; h1 = FDN_TMP[1]; h2 = FDN_TMP[2]; h3 = FDN_TMP[3];\n  h4 = FDN_TMP[4]; h5 = FDN_TMP[5]; h6 = FDN_TMP[6]; h7 = FDN_TMP[7];\n  fL = (h0 - h1 + h2 - h3 + h4 - h5 + h6 - h7)*0.35355339;\n  fR = (h0 + h1 - h2 - h3 + h4 + h5 - h6 - h7)*0.35355339;\n  // 8-point fast Walsh-Hadamard: lossless mixing\n  a0 = h0 + h1; a1 = h0 - h1; a2 = h2 + h3; a3 = h2 - h3;\n  a4 = h4 + h5; a5 = h4 - h5; a6 = h6 + h7; a7 = h6 - h7;\n  b0 = a0 + a2; b2 = a0 - a2; b1 = a1 + a3; b3 = a1 - a3;\n  b4 = a4 + a6; b6 = a4 - a6; b5 = a5 + a7; b7 = a5 - a7;\n  FDN_TMP[0] = b0 + b4; FDN_TMP[4] = b0 - b4; FDN_TMP[1] = b1 + b5; FDN_TMP[5] = b1 - b5;\n  FDN_TMP[2] = b2 + b6; FDN_TMP[6] = b2 - b6; FDN_TMP[3] = b3 + b7; FDN_TMP[7] = b3 - b7;\n  fin *= 0.35355339; fsi *= 0.35355339;\n  fp = FDN_BASE; i = 0;\n  loop(8,\n    buf = fp[0]; w = fp[2];\n    buf[w] = FDN_TMP[i]*0.35355339 + fin*FDN_SIGN[i] + fsi*FDN_SIGN[8 + i];\n    w += 1; w >= fp[1] ? w = 0; fp[2] = w;\n    fp += FDN_STRIDE; i += 1;\n  );\n  fL *= fdn_norm; fR *= fdn_norm;\n);\nfdn_mono = 0.5*(fL + fR);\n\n// ---- rattle: contact chatter once the vibration exceeds a gap\nrat_amt > 0 ? (\n  rs = (wg_mono*rat_wg + fdn_mono*rat_fdn + mod_mono*rat_mod)*rat_g;\n  dz = rs - max(-1, min(1, rs));\n  rat = rat_c*(rat + dz - rdz1); rdz1 = dz;\n) : rat = 0;\n\n// ---- mix the engines\nnl = rat*rat_og*rat_to_out + crk*crk_to_out;\nwL = wgL*o_wg + mL*o_mod + fL*o_fdn + nl;\nwR = wgR*o_wg + mR*o_mod + fR*o_fdn + nl;\n\n// material's own tone\nohL = ohp_c*(ohL + wL - ohxL); ohxL = wL; wL = ohL;\nohR = ohp_c*(ohR + wR - ohxR); ohxR = wR; wR = ohR;\nolL += olp_c*(wL - olL); wL = olL;\nolR += olp_c*(wR - olR); wR = olR;\n\n// user low/high cut\nlc_on ? (\n  o = BIQ + 5;\n  t = o[0]*wL + o[1]*lcxL1 + o[2]*lcxL2 - o[3]*lcyL1 - o[4]*lcyL2; lcxL2 = lcxL1; lcxL1 = wL; lcyL2 = lcyL1; lcyL1 = t; wL = t;\n  t = o[0]*wR + o[1]*lcxR1 + o[2]*lcxR2 - o[3]*lcyR1 - o[4]*lcyR2; lcxR2 = lcxR1; lcxR1 = wR; lcyR2 = lcyR1; lcyR1 = t; wR = t;\n);\nhc_on ? (\n  o = BIQ + 10;\n  t = o[0]*wL + o[1]*hcxL1 + o[2]*hcxL2 - o[3]*hcyL1 - o[4]*hcyL2; hcxL2 = hcxL1; hcxL1 = wL; hcyL2 = hcyL1; hcyL1 = t; wL = t;\n  t = o[0]*wR + o[1]*hcxR1 + o[2]*hcxR2 - o[3]*hcyR1 - o[4]*hcyR2; hcxR2 = hcxR1; hcxR1 = wR; hcyR2 = hcyR1; hcyR1 = t; wR = t;\n);\n\n// width, trim\nmid = 0.5*(wL + wR)*trim_g; sid = 0.5*(wL - wR)*wid_s*trim_g;\nwL = mid + sid; wR = mid - sid;\n\n// soft ceiling on the wet signal only: linear below 0.9, approaches 1.0\naw = abs(wL); aw > 0.9 ? ( e = aw - 0.9; wL = sign(wL)*(0.9 + 0.1*e/(0.1 + e)); );\naw = abs(wR); aw > 0.9 ? ( e = aw - 0.9; wR = sign(wR)*(0.9 + 0.1*e/(0.1 + e)); );\n\nspl0 = (inL*dry_s + wL*wet_s)*outg_s;\nspl1 = (inR*dry_s + wR*wet_s)*outg_s;\n\n// GUI meters (wet signal, and the dense field's activity)\naw = abs(wL); mtr_l = aw > mtr_l ? aw : mtr_l*mtr_dec;\naw = abs(wR); mtr_r = aw > mtr_r ? aw : mtr_r*mtr_dec;\naw = abs(fdn_mono); fdn_glow = aw > fdn_glow ? aw : fdn_glow*mtr_dec;\n\n@gfx 760 480\n\n// ---------------------------------------------------------------------------\n// Layout in logical units on a 760 x 480 canvas, scaled to the window (and\n// to Retina via gfx_ext_retina).\n// ---------------------------------------------------------------------------\nui_s = max(0.5, min(gfx_w/760, gfx_h/480));\nui_ox = max(0, (gfx_w - 760*ui_s)/2);\nui_s != ui_fs ? (\n  ui_fs = ui_s;\n  gfx_setfont(1, \"Arial\", max(8, 13*ui_s));\n  gfx_setfont(2, \"Arial\", max(8, 22*ui_s), 'b');\n  gfx_setfont(3, \"Arial\", max(8, 11*ui_s));\n  gfx_setfont(4, \"Arial\", max(8, 20*ui_s), 'b');\n  gfx_setfont(5, \"Arial\", max(8, 12*ui_s), 'b');\n  gfx_setfont(6, \"Arial\", max(8, 10.5*ui_s), 'b');\n);\nui_mat = slider1|0;\nui_mx = mouse_x; ui_my = mouse_y;\nui_down = mouse_cap & 1;\nui_pressed = ui_down && !ui_last_down;\nui_released = !ui_down && ui_last_down;\nui_last_down = ui_down;\n\n// Embedded in the track or mixer panel (gfx_ext_flags & 1) there is no room\n// for the full interface: show the material and the wet meters.\ngfx_ext_flags & 1 ? (\n  ui_rgb(0.075, 0.082, 0.098, 1); gfx_rect(0, 0, gfx_w, gfx_h);\n  ui_efs != gfx_h ? ( ui_efs = gfx_h; gfx_setfont(7, \"Arial\", max(8, min(16, gfx_h*0.45)), 'b'); );\n  gfx_setfont(7); ui_rgb(0.96, 0.66, 0.29, 1);\n  ui_text(100 + ui_mat, 4, 0, max(0, gfx_w - 22), gfx_h, 4);\n  ui_i = 0;\n  loop(2,\n    ui_v = ui_i == 0 ? mtr_l : mtr_r;\n    ui_v = max(0, min(1, (20*log10(max(ui_v, 0.000001)) + 60)/60));\n    ui_x = gfx_w - 14 + ui_i*6;\n    ui_rgb(1, 1, 1, 0.08); gfx_rect(ui_x, 2, 4, gfx_h - 4);\n    ui_rgb(0.35, 0.85, 0.55, 0.9); gfx_rect(ui_x, 2 + (1 - ui_v)*(gfx_h - 4), 4, ui_v*(gfx_h - 4));\n    ui_i += 1;\n  );\n) : (\n\nui_rgb(0.075, 0.082, 0.098, 1); gfx_rect(0, 0, gfx_w, gfx_h);\n\n// ---- header\nui_x0 = ui_ox + 20*ui_s;\ngfx_setfont(2); ui_rgb(0.93, 0.93, 0.94, 1);\nui_text(\"REVERBERATOR\", ui_x0, 12*ui_s, 400*ui_s, 26*ui_s, 0);\ngfx_setfont(3); ui_rgb(0.55, 0.58, 0.63, 1);\nui_text(\"Physically modelled material reverb\", ui_x0, 40*ui_s, 400*ui_s, 14*ui_s, 0);\ngfx_setfont(4); ui_rgb(0.96, 0.66, 0.29, 1);\nui_text(100 + ui_mat, ui_ox + 300*ui_s, 12*ui_s, 440*ui_s, 26*ui_s, 2);\ngfx_setfont(3); ui_rgb(0.75, 0.77, 0.8, 1);\nui_text(150 + ui_mat, ui_ox + 300*ui_s, 40*ui_s, 440*ui_s, 14*ui_s, 2);\n\n// ---- material tiles, 5 x 4\ngfx_setfont(1);\nui_tw = (720 - 4*6)/5;\nui_i = 0;\nloop(20,\n  ui_tx = ui_ox + (20 + (ui_i % 5)*(ui_tw + 6))*ui_s;\n  ui_ty = (64 + floor(ui_i/5)*36)*ui_s;\n  ui_hot = ui_mx >= ui_tx && ui_mx < ui_tx + ui_tw*ui_s && ui_my >= ui_ty && ui_my < ui_ty + 30*ui_s;\n  ui_hot && ui_pressed && ui_drag < 0 ? ( ui_setslider(1, ui_i); ui_endtouch(1); ui_mat = ui_i; );\n  ui_i == ui_mat ? ui_rgb(0.96, 0.66, 0.29, 1) : ui_hot ? ui_rgb(0.19, 0.21, 0.25, 1) : ui_rgb(0.125, 0.137, 0.165, 1);\n  gfx_rect(ui_tx, ui_ty, ui_tw*ui_s, 30*ui_s);\n  ui_i == ui_mat ? ui_rgb(0.08, 0.08, 0.09, 1) : ui_rgb(0.85, 0.86, 0.88, 1);\n  ui_text(100 + ui_i, ui_tx, ui_ty, ui_tw*ui_s, 30*ui_s, 1|4);\n  ui_i += 1;\n);\n\n// ---- what's ringing: every resonance of the current material\nui_rx = ui_ox + 20*ui_s; ui_ry = 214*ui_s; ui_rw = 720*ui_s; ui_rh = 132*ui_s;\nui_rgb(0.1, 0.11, 0.13, 1); gfx_rect(ui_rx, ui_ry, ui_rw, ui_rh);\nui_px = ui_rx + 12*ui_s; ui_pw = 652*ui_s; ui_py = ui_ry + 24*ui_s; ui_ph = 84*ui_s;\nui_base = ui_py + ui_ph;\n// frequency grid\ngfx_setfont(3);\nui_i = 0;\nloop(8,\n  ui_f = ui_i==0?50:ui_i==1?100:ui_i==2?200:ui_i==3?500:ui_i==4?1000:ui_i==5?2000:ui_i==6?5000:10000;\n  ui_x = ui_fx(ui_f);\n  ui_rgb(1, 1, 1, 0.06); gfx_line(ui_x, ui_py, ui_x, ui_base);\n  ui_rgb(0.45, 0.48, 0.53, 1);\n  sprintf(#ui_lbl, ui_f >= 1000 ? \"%dk\" : \"%d\", ui_f >= 1000 ? ui_f/1000 : ui_f);\n  ui_text(#ui_lbl, ui_x - 20*ui_s, ui_base + 3*ui_s, 40*ui_s, 12*ui_s, 1);\n  ui_i += 1;\n);\nui_rgb(1, 1, 1, 0.12); gfx_line(ui_px, ui_base, ui_px + ui_pw, ui_base);\n// dense field: a band whose height is its decay and brightness its activity\nfdn_on ? (\n  ui_h = ui_th(fdn_disp_t60)*ui_ph;\n  ui_g = min(1, sqrt(fdn_glow)*2);\n  ui_x = ui_fx(max(40, fdn_hp)); ui_w = ui_fx(16000) - ui_x;\n  ui_rgb(0.55, 0.5, 0.95, 0.05 + 0.2*ui_g);\n  gfx_rect(ui_x, ui_base - ui_h, ui_w, ui_h);\n  ui_rgb(0.55, 0.5, 0.95, 0.35 + 0.5*ui_g);\n  gfx_line(ui_x, ui_base - ui_h, ui_x + ui_w, ui_base - ui_h);\n);\n// strings, wires and air columns: their partials; chirp paths: a band\nui_i = 0; ui_p = WG_BASE; ui_nstr = 0;\nloop(n_wg,\n  ui_f = ui_p[18];\n  ui_g = min(1, sqrt(ui_p[20]*wg_norm)*2.5);\n  ui_h = ui_th(ui_p[19])*ui_ph;\n  ui_f > 0 ? (\n    ui_nstr += 1;\n    ui_n = 1;\n    loop(min(40, floor(16000/ui_f)),\n      ui_rgb(0.35, 0.85, 0.85, (0.12 + 0.8*ui_g)/sqrt(ui_n));\n      ui_x = ui_fx(ui_f*ui_n);\n      gfx_line(ui_x, ui_base, ui_x, ui_base - ui_h/sqrt(ui_n));\n      ui_n += 1;\n    );\n  ) : (\n    ui_rgb(0.35, 0.85, 0.85, 0.06 + 0.3*ui_g);\n    gfx_rect(ui_fx(250), ui_base - ui_h, ui_fx(6000) - ui_fx(250), ui_h);\n  );\n  ui_p += WG_STRIDE; ui_i += 1;\n);\n// individual resonances: height = how long it rings, glow = how hard it is ringing now\nui_p = MOD_BASE;\nloop(n_modes,\n  ui_f = ui_p[10];\n  ui_c = cos(2*$pi*ui_f/srate);\n  ui_a = sqrt(max(0, ui_p[2]*ui_p[2] + ui_p[3]*ui_p[3] - 2*ui_c*ui_p[2]*ui_p[3])/max(0.000001, 1 - ui_c*ui_c));\n  ui_a *= sqrt(ui_p[4]*ui_p[4] + ui_p[5]*ui_p[5])*mod_norm;\n  ui_g = min(1, sqrt(ui_a)*3);\n  ui_h = ui_th(ui_p[11])*ui_ph;\n  ui_x = ui_fx(ui_f);\n  ui_rgb(0.96, 0.66, 0.29, 0.3 + 0.7*ui_g);\n  gfx_line(ui_x, ui_base, ui_x, ui_base - ui_h);\n  gfx_rect(ui_x - 1*ui_s, ui_base - ui_h - 1*ui_s, 2*ui_s + 1, 2*ui_s + 1);\n  ui_p += MOD_STRIDE;\n);\n// caption\ngfx_setfont(5); ui_rgb(0.55, 0.58, 0.63, 1);\nui_text(\"WHAT\u00e2\u0080\u0099S RINGING\", ui_px, ui_ry + 6*ui_s, 200*ui_s, 14*ui_s, 0);\ngfx_setfont(3); ui_rgb(0.62, 0.65, 0.7, 1);\n#ui_cap = \"\";\nn_modes > 0 ? ( sprintf(#ui_lbl, \"%d resonances\", n_modes); strcat(#ui_cap, #ui_lbl); );\nui_nstr > 0 ? ( sprintf(#ui_lbl, \"%s%d %s\", strlen(#ui_cap) ? \"  \u00c2\u00b7  \" : \"\", ui_nstr, ui_nstr == 1 ? \"string/air column\" : \"strings/air columns\"); strcat(#ui_cap, #ui_lbl); );\nui_nstr < n_wg ? ( sprintf(#ui_lbl, \"%s%d dispersive paths\", strlen(#ui_cap) ? \"  \u00c2\u00b7  \" : \"\", n_wg - ui_nstr); strcat(#ui_cap, #ui_lbl); );\nfdn_on ? ( sprintf(#ui_lbl, \"%sDense field %.2g modes/Hz\", strlen(#ui_cap) ? \"  \u00c2\u00b7  \" : \"\", fdn_disp_dens); strcat(#ui_cap, #ui_lbl); );\nui_text(#ui_cap, ui_px + 120*ui_s, ui_ry + 7*ui_s, 540*ui_s, 14*ui_s, 2);\n// wet output meters\nui_i = 0;\nloop(2,\n  ui_x = ui_rx + (684 + ui_i*14)*ui_s;\n  ui_v = ui_i == 0 ? mtr_l : mtr_r;\n  ui_v = max(0, min(1, (20*log10(max(ui_v, 0.000001)) + 60)/60));\n  ui_rgb(1, 1, 1, 0.07); gfx_rect(ui_x, ui_py, 10*ui_s, ui_ph);\n  ui_rgb(0.35, 0.85, 0.55, 0.9); gfx_rect(ui_x, ui_base - ui_v*ui_ph, 10*ui_s, ui_v*ui_ph);\n  ui_i += 1;\n);\nui_rgb(0.45, 0.48, 0.53, 1);\nui_text(\"WET\", ui_rx + 680*ui_s, ui_base + 3*ui_s, 32*ui_s, 12*ui_s, 1);\n\n// ---- knobs\nui_cw = 720/11;\nui_ky = 392*ui_s; ui_kr = 19*ui_s;\nui_hotk = -1;\nui_i = 0;\nloop(11,\n  ui_kx = ui_ox + (20 + ui_cw*(ui_i + 0.5))*ui_s;\n  abs(ui_mx - ui_kx) < ui_cw*ui_s/2 && ui_my > ui_ky - 30*ui_s && ui_my < ui_ky + 50*ui_s ? ui_hotk = ui_i;\n  ui_i += 1;\n);\n// mouse: press to grab, drag up/down, shift for fine, double-click for default\nui_pressed && ui_hotk >= 0 ? (\n  ui_t = time_precise();\n  ui_t - ui_click_t < 0.35 && ui_click_k == ui_hotk ? (\n    ui_setslider(UI_KNOBS[ui_hotk*6], UI_KNOBS[ui_hotk*6+4]);\n    ui_endtouch(UI_KNOBS[ui_hotk*6]);\n    ui_click_k = -1;\n  ) : (\n    ui_drag = ui_hotk; ui_y0 = ui_my;\n    ui_n0 = ui_norm(ui_drag, slider(UI_KNOBS[ui_drag*6]));\n    ui_click_t = ui_t; ui_click_k = ui_hotk;\n  );\n);\nui_down && ui_drag >= 0 ? (\n  ui_fine = mouse_cap & 8 ? 0.1 : 1;\n  ui_setslider(UI_KNOBS[ui_drag*6], ui_denorm(ui_drag, ui_n0 + (ui_y0 - ui_my)/(200*ui_s)*ui_fine));\n);\nui_released ? ( ui_drag >= 0 ? ui_endtouch(UI_KNOBS[ui_drag*6]); ui_drag = -1; );\nmouse_wheel != 0 ? (\n  ui_hotk >= 0 ? (\n    ui_setslider(UI_KNOBS[ui_hotk*6],\n      ui_denorm(ui_hotk, ui_norm(ui_hotk, slider(UI_KNOBS[ui_hotk*6])) + (mouse_wheel/120)*0.02));\n    ui_endtouch(UI_KNOBS[ui_hotk*6]);\n  );\n  mouse_wheel = 0;\n);\nui_i = 0;\nloop(11,\n  ui_kx = ui_ox + (20 + ui_cw*(ui_i + 0.5))*ui_s;\n  ui_v = slider(UI_KNOBS[ui_i*6]);\n  ui_n = ui_norm(ui_i, ui_v);\n  // bipolar knobs draw their arc from the default, the rest from the minimum\n  ui_n0d = (ui_i == 3 || ui_i == 4 || ui_i == 10) ? ui_norm(ui_i, UI_KNOBS[ui_i*6+4]) : 0;\n  ui_a0 = -0.75*$pi + 1.5*$pi*min(ui_n, ui_n0d);\n  ui_a1 = -0.75*$pi + 1.5*$pi*max(ui_n, ui_n0d);\n  ui_rgb(1, 1, 1, 0.1);\n  ui_arc(ui_kx, ui_ky, ui_kr, -0.75*$pi, 0.75*$pi, 3*ui_s);\n  ui_rgb(0.96, 0.66, 0.29, ui_i == ui_hotk || ui_i == ui_drag ? 1 : 0.85);\n  ui_a1 > ui_a0 + 0.001 ? ui_arc(ui_kx, ui_ky, ui_kr, ui_a0, ui_a1, 3*ui_s);\n  ui_a = -0.75*$pi + 1.5*$pi*ui_n;\n  ui_i == ui_hotk || ui_i == ui_drag ? ui_rgb(0.17, 0.19, 0.22, 1) : ui_rgb(0.13, 0.145, 0.17, 1);\n  gfx_circle(ui_kx, ui_ky, ui_kr - 5*ui_s, 1, 1);\n  ui_rgb(0.93, 0.93, 0.94, 1);\n  gfx_line(ui_kx + sin(ui_a)*(ui_kr - 14*ui_s), ui_ky - cos(ui_a)*(ui_kr - 14*ui_s),\n           ui_kx + sin(ui_a)*(ui_kr - 6*ui_s),  ui_ky - cos(ui_a)*(ui_kr - 6*ui_s), 1);\n  gfx_setfont(6); ui_rgb(0.55, 0.58, 0.63, 1);\n  ui_text(300 + ui_i, ui_kx - ui_cw*ui_s/2, ui_ky + 25*ui_s, ui_cw*ui_s, 14*ui_s, 1);\n  gfx_setfont(1); ui_rgb(0.93, 0.93, 0.94, 1);\n  ui_value_str(ui_i, ui_v);\n  ui_text(#ui_val, ui_kx - ui_cw*ui_s/2, ui_ky + 40*ui_s, ui_cw*ui_s, 15*ui_s, 1);\n  ui_i += 1;\n);\ngfx_setfont(3); ui_rgb(0.4, 0.43, 0.48, 1);\nui_text(\"Drag a knob up or down  \u00c2\u00b7  Shift-drag for fine control  \u00c2\u00b7  Double-click to reset  \u00c2\u00b7  Scroll to adjust\",\n        ui_ox, 460*ui_s, 760*ui_s, 14*ui_s, 1);\n\n);  // end of the full (non-embedded) interface\n"};

/* ---- kit/palette.js ---- */
/* The devices' colours in Live: after Ableton Live 8's default theme.
 *
 * The scheme is Starting Blocks' own experiment of 18 September 2026
 * (commit 2765b0a3, "theme the window after Live 8"): a neutral grey chrome
 * meant to sit quietly under brightly coloured clips, controls raised off it,
 * and one warm amber spent where Live spends its accent, on what is switched
 * on. It was built from the theme's described character, not Live's own
 * files, so it is a likeness, not a match.
 *
 * Two changes from that experiment, both for the family's rules (every word
 * 7:1 on what it sits on, ink on every button, marks and edges 3:1):
 *   - the chrome is #3E3E3E, a step darker than its #4A4A4A, because on
 *     #4A4A4A a secondary word cannot reach 7:1 and still look secondary;
 *   - buttons are a light grey with dark ink, as the house scheme's are,
 *     because light words on its #5E5E5E buttons reach only 5:1.
 * The greys are neutral (R = G = B), as Live's are: the house rule that
 * every grey leans blue is the yellow scheme's, and Live's look is not that.
 *
 * Palette.tone(r, g, b) is how the REAPER windows (the JSFX and Lua scripts,
 * drawn through gfx.js) take the scheme without a line of theirs changing:
 *   - the house scheme's own colours map one for one (HOUSE below), each
 *     chosen so the pairs the scripts rely on stay 7:1 for words and 3:1
 *     for edges;
 *   - the house yellow, and the shades the scripts make of it, become the
 *     amber, shaded the same way;
 *   - any other grey loses its tint at the same brightness, so a script
 *     with a palette of its own keeps every contrast it had;
 *   - every other colour (a material, an engine, a part) is left alone.
 */
var Palette = (function () {
  'use strict';
  var C = {
    ground: 0x3E3E3E,     // the chrome: Live 8's #4A4A4A, a step darker (see above)
    raised: 0x484848,     // a control that is off
    sunken: 0x2E2E2E,     // lists, fields, a roll or a page: Live 8's roll ground
    deep: 0x262626,       // a roll's own ground under a sunken frame
    popup: 0x333333,      // menus
    rule: 0x555555,       // separators: they group, they do not act
    edge: 0x8C8C8C,       // the edge of anything that acts: 3.2:1 on the chrome
    control: 0xB4B4B4,    // buttons, with ink on them
    controlHover: 0xC4C4C4,
    controlHeld: 0xAAAAAA,
    accent: 0xD7A93C,     // Live 8's warm amber: what is on
    accentHeld: 0xCDA139,  // held: ink on it still 7.2:1
    ink: 0x1A1A1A,        // words on a button, grey or amber; also a window's darkest ground
                          // (AutoCC paints its window in the ink), so words are 7:1 on it too
    text: 0xF0F0F0,       // 9.4:1 on the chrome
    label: 0xD8D8D8,      // 7.5:1
    dim: 0xD4D4D4,        // secondary words, 7.2:1
    mark: 0xA8A8A8,       // a mark that is not a word, or a control that is off
    note: 0xA8D8E8,       // Live 8's cool note colour, for a roll
    ring: 0xFAFAFA,       // the keyboard's place
    warn: 0xF0605A,       // a warning's mark, never its words: 3.3:1 on the chrome
    warnText: 0xFFC8C2    // a warning's words, 7.3:1
  };
  // The house scheme (HousePalette, every family repo's docs/COLOUR.md) to this one.
  var HOUSE = {
    0x111419: C.deep, 0x14171C: C.ink, 0x1A1D23: C.sunken, 0x1B1F25: C.popup, 0x1E2228: 0x343434,
    0x22262D: 0x363636, 0x23272E: C.ground, 0x2A2F37: C.raised, 0x3A404A: C.rule, 0x585F6B: 0x707070,
    0x646B77: 0x7A7A7A, 0x6D7581: C.edge, 0x8A919C: C.mark, 0x8F96A2: C.controlHeld, 0xA9AFBA: C.control,
    0xB0B6C0: C.dim, 0xB6BCC6: C.dim, 0xBFC5CE: C.label, 0xC0C6CF: C.controlHover, 0xDDE1E7: C.text,
    0xF2F4F7: C.ring, 0xFFF200: C.accent, 0xD1C600: C.accentHeld, 0xFF9E96: C.warnText, 0xFFA6A0: C.warnText, 0xD2483F: C.warn
  };
  function rgb(hex, a) {
    return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, a === undefined ? 1 : a];
  }
  function lin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function unlin(l) { return l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055; }
  function luminance(r, g, b) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
  function contrast(a, b) {
    var la = luminance(a[0], a[1], a[2]), lb = luminance(b[0], b[1], b[2]);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  var AMBER = rgb(C.accent);
  // r, g, b from 0 to 1; returns [r, g, b].
  function tone(r, g, b) {
    r = clamp(r); g = clamp(g); b = clamp(b);
    var R = Math.round(r * 255), G = Math.round(g * 255), B = Math.round(b * 255);
    var hex = (R << 16) | (G << 8) | B;
    if (HOUSE[hex] !== undefined) { var t = rgb(HOUSE[hex]); return [t[0], t[1], t[2]]; }
    // The house yellow and its shades: lighter ones mix in white (blue rises
    // from 0), darker ones scale down (red and green fall together).
    if (R >= 120 && G >= 110 && Math.abs(R - G) <= 40 && B <= Math.min(R, G) - 90) {
      var w = B / 255, k = Math.max(R, G) / 255;
      return [0, 1, 2].map(function (i) { return clamp(AMBER[i] * k + (1 - AMBER[i] * k) * w); });
    }
    // A grey with a tint, from any palette: neutral at the same brightness.
    var hi = Math.max(R, G, B), lo = Math.min(R, G, B);
    if (hi - lo <= 28) { var n = unlin(luminance(r, g, b)); return [n, n, n]; }
    return [r, g, b];
  }
  return { C: C, HOUSE: HOUSE, rgb: rgb, tone: tone, luminance: luminance, contrast: contrast };
})();


/* ---- kit/runtime/jsfx.js ---- */
/* Middaw's JSFX runtime: the family's REAPER plug-ins, run unchanged.
 *
 * A JSFX file is a header (sliders, pins, imports) and sections of EEL2 code:
 * @init, @slider, @block, @sample, @serialize and @gfx. This file reads the
 * header, compiles the EEL2 in each section to JavaScript, and runs it the way
 * REAPER does: @init once, @slider when a slider moves, then for every block
 * @block once and @sample once per sample frame. MIDI arrives through
 * midirecv() and leaves through midisend() with its sample offset.
 *
 * @gfx is not run by default: Middaw draws each device's controls itself from
 * the sliders, so a device looks like the rest of the app. With
 * `{ gfx: true }` it is compiled too, and `runGfx(host, ...)` runs it: every
 * gfx_* call goes to the host, which draws (the Ableton devices' [v8ui]).
 *
 * Everything in EEL2 is a double. Variables live in one Float64Array, so the
 * generated code reads `v[12]`; memory (`buf[i]`) is EEL2's 8M words, given
 * out in 64k-word blocks only when written to, as EEL2 itself does.
 */
(function (NS) {
  'use strict';

  var EPS = 0.00001;
  var MAXLOOP = 1048576;
  var BLOCK = 65536, NBLOCKS = 128;

  // ------------------------------------------------------------ header ----
  function parseSliderLine(line) {
    var m = /^slider(\d+):(?:([A-Za-z_][\w.]*)=)?\s*([^<]*?)\s*<([^>]*)>(.*)$/.exec(line);
    if (!m) return null;
    var inner = m[4], enumNames = null;
    var em = /\{([^}]*)\}/.exec(inner);
    if (em) { enumNames = em[1].split(','); inner = inner.replace(em[0], ''); }
    var shape = null, sm = /:(log|sqr)(?:=([^,>]*))?/.exec(inner);
    if (sm) { shape = { kind: sm[1], value: sm[2] === undefined ? null : Number(sm[2]) }; inner = inner.replace(sm[0], ''); }
    var parts = inner.split(',').map(function (s) { return s.trim(); });
    var desc = m[5].trim();
    var hidden = desc[0] === '-';
    if (hidden) desc = desc.slice(1);
    return {
      index: Number(m[1]), variable: (m[2] || ('slider' + m[1])).toLowerCase(),
      def: Number(m[3]) || 0, min: Number(parts[0]) || 0, max: parts[1] === undefined ? 1 : Number(parts[1]),
      step: parts[2] === undefined || parts[2] === '' ? 0 : Number(parts[2]),
      names: enumNames, shape: shape, name: desc, hidden: hidden
    };
  }

  // A JSFX file and its imports -> header and sections.
  function parseFile(text, readImport) {
    var out = { desc: '', sliders: [], inPins: [], outPins: [], options: '', sections: {}, gfxSize: null };
    var order = ['init', 'slider', 'block', 'sample', 'serialize', 'gfx'];
    order.forEach(function (s) { out.sections[s] = []; });
    function take(src, isImport) {
      var lines = src.replace(/\r\n?/g, '\n').split('\n');
      var section = null, buf = [], startLine = 0;
      function flush() {
        if (section && out.sections[section]) out.sections[section].push({ code: buf.join('\n'), line: startLine });
        buf = [];
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var sm = /^@(\w+)(.*)$/.exec(line);
        if (sm) {
          flush();
          section = sm[1].toLowerCase();
          startLine = i + 2;
          if (section === 'gfx') {
            var sz = sm[2].trim().split(/\s+/).map(Number);
            if (sz.length >= 2 && !out.gfxSize) out.gfxSize = [sz[0], sz[1]];
          }
          continue;
        }
        if (section) { buf.push(line); continue; }
        var t = line.trim();
        if (/^desc:/.test(t)) { if (!isImport || !out.desc) out.desc = t.slice(5).trim(); }
        else if (/^slider\d+:/.test(t)) { var s = parseSliderLine(t); if (s) out.sliders.push(s); }
        else if (/^in_pin:/.test(t)) out.inPins.push(t.slice(7).trim());
        else if (/^out_pin:/.test(t)) out.outPins.push(t.slice(8).trim());
        else if (/^options:/.test(t)) out.options += ' ' + t.slice(8).trim();
        else if (/^import\s+/.test(t)) {
          var name = t.replace(/^import\s+/, '').trim();
          var inc = readImport ? readImport(name) : null;
          if (inc === null || inc === undefined) throw new Error('JSFX import not found: ' + name);
          take(inc, true);
        }
      }
      flush();
    }
    take(text, false);
    out.sliders.sort(function (a, b) { return a.index - b.index; });
    out.inPins = out.inPins.filter(function (p) { return p !== 'none'; });
    out.outPins = out.outPins.filter(function (p) { return p !== 'none'; });
    return out;
  }

  // ------------------------------------------------------------- lexer ----
  var OPS = ['===', '!==', '<<=', '>>=', '==', '!=', '<=', '>=', '<<', '>>', '&&', '||',
    '+=', '-=', '*=', '/=', '%=', '^=', '|=', '&=', '~=',
    '+', '-', '*', '/', '%', '^', '<', '>', '!', '&', '|', '~', '?', ':',
    '(', ')', '[', ']', ',', ';', '='];
  var CONSTS = { pi: Math.PI, phi: (1 + Math.sqrt(5)) / 2, e: Math.E };

  function EelError(msg, line) { this.message = (line ? 'line ' + line + ': ' : '') + msg; this.line = line; }
  EelError.prototype = Object.create(Error.prototype);
  EelError.prototype.name = 'EelError';

  // REAPER's strings are bytes: one character per UTF-8 byte, as the C runtime
  // keeps them.
  function bytes(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.codePointAt(i);
      if (c > 0xffff) i++;
      if (c < 0x80) out += String.fromCharCode(c);
      else if (c < 0x800) out += String.fromCharCode(0xc0 | c >> 6, 0x80 | c & 63);
      else if (c < 0x10000) out += String.fromCharCode(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
      else out += String.fromCharCode(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return out;
  }

  function lex(src, firstLine) {
    var toks = [], i = 0, n = src.length, line = firstLine || 1;
    while (i < n) {
      var c = src[i];
      if (c === '\n') { line++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { var j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
      if (c === '/' && src[i + 1] === '*') {
        var k = src.indexOf('*/', i + 2); if (k < 0) k = n;
        for (var q = i; q < k; q++) if (src[q] === '\n') line++;
        i = k + 2; continue;
      }
      if (c === '"') {
        var buf = '', p = i + 1;
        while (p < n && src[p] !== '"') {
          if (src[p] === '\\' && p + 1 < n) {
            var e = src[p + 1];
            buf += e === 'n' ? '\n' : e === 't' ? '\t' : e === 'r' ? '\r' : e; p += 2;
          } else { if (src[p] === '\n') line++; buf += src[p++]; }
        }
        toks.push({ k: 'str', v: bytes(buf), line: line }); i = p + 1; continue;
      }
      if (c === "'") {
        var close = src.indexOf("'", i + 1);
        var val = 0;
        var lit = bytes(src.slice(i + 1, close));
        for (var x = 0; x < lit.length; x++) val = val * 256 + lit.charCodeAt(x);
        toks.push({ k: 'num', v: val, line: line }); i = close + 1; continue;
      }
      if (c === '#') {
        var nm = /^#[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i, i + 200));
        if (nm) { toks.push({ k: 'nstr', v: nm[0].toLowerCase(), line: line }); i += nm[0].length; }
        else { toks.push({ k: 'tmpstr', line: line }); i++; }
        continue;
      }
      if (c === '$') {
        var rest = src.slice(i, i + 64), m;
        if ((m = /^\$x([0-9A-Fa-f]+)/.exec(rest))) { toks.push({ k: 'num', v: parseInt(m[1], 16), line: line }); i += m[0].length; continue; }
        if ((m = /^\$'(.)'/.exec(rest))) { toks.push({ k: 'num', v: m[1].charCodeAt(0), line: line }); i += m[0].length; continue; }
        if ((m = /^\$~(\d+)/.exec(rest))) { toks.push({ k: 'num', v: Math.pow(2, Number(m[1])) - 1, line: line }); i += m[0].length; continue; }
        if ((m = /^\$(pi|phi|e)\b/i.exec(rest))) { toks.push({ k: 'num', v: CONSTS[m[1].toLowerCase()], line: line }); i += m[0].length; continue; }
        throw new EelError('bad $ constant', line);
      }
      var hx = /^0[xX][0-9A-Fa-f]+/.exec(src.slice(i, i + 40));
      if (hx) { toks.push({ k: 'num', v: parseInt(hx[0], 16), line: line }); i += hx[0].length; continue; }
      var num = /^(\d+\.\d*|\.\d+|\d+)/.exec(src.slice(i, i + 64));
      if (num) { toks.push({ k: 'num', v: Number(num[0]), line: line }); i += num[0].length; continue; }
      var id = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i, i + 200));
      if (id) {
        var w = id[0].toLowerCase();
        toks.push({ k: (w === 'function' || w === 'local' || w === 'instance' || w === 'globals' || w === 'global' || w === 'static') ? 'kw' : 'id', v: w, line: line });
        i += id[0].length; continue;
      }
      var op = null;
      for (var o = 0; o < OPS.length; o++) if (src.substr(i, OPS[o].length) === OPS[o]) { op = OPS[o]; break; }
      if (!op) throw new EelError("unexpected '" + c + "'", line);
      toks.push({ k: 'op', v: op, line: line }); i += op.length;
    }
    toks.push({ k: 'eof', line: line });
    return toks;
  }

  // ------------------------------------------------------------ parser ----
  var ASSIGN = { '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1, '^=': 1, '|=': 1, '&=': 1, '~=': 1, '<<=': 1, '>>=': 1 };
  var CMP = { '==': 1, '===': 1, '!=': 1, '!==': 1, '<': 1, '>': 1, '<=': 1, '>=': 1 };

  function parse(toks, funcs) {
    var p = 0;
    function peek() { return toks[p]; }
    function at(k, v) { var t = toks[p]; return t.k === k && (v === undefined || t.v === v); }
    function eat(k, v) { if (at(k, v)) return toks[p++]; return null; }
    function expect(k, v) {
      var t = eat(k, v);
      if (!t) { var q = toks[p]; throw new EelError('expected ' + (v || k) + ', got ' + (q.v !== undefined ? q.v : q.k), q.line); }
      return t;
    }

    function program() {
      var items = [];
      for (;;) {
        while (eat('op', ';')) {}
        if (at('eof')) break;
        if (at('kw', 'function')) { func(); continue; }
        items.push(assign());
        if (!at('op', ';') && !at('eof') && !at('kw', 'function')) {
          var t = peek();
          throw new EelError("missing ';' before " + (t.v !== undefined ? t.v : t.k), t.line);
        }
      }
      return { k: 'seq', items: items };
    }
    function func() {
      var line = expect('kw', 'function').line;
      var name = expect('id').v;
      expect('op', '(');
      var params = [];
      while (!at('op', ')')) { params.push(expect('id').v.replace(/\*$/, '')); eat('op', ','); }
      expect('op', ')');
      var locals = [], instance = [], globals = null;
      while (at('kw')) {
        var kw = toks[p++].v;
        expect('op', '(');
        var list = [];
        while (!at('op', ')')) {
          if (at('op', '*')) { p++; list.push('*'); }
          else list.push(expect('id').v.replace(/\*$/, ''));
          eat('op', ',');
        }
        expect('op', ')');
        if (kw === 'local' || kw === 'static') locals = locals.concat(list);
        else if (kw === 'instance') instance = instance.concat(list);
        else globals = (globals || []).concat(list);
      }
      expect('op', '(');
      var body = block();
      expect('op', ')');
      while (eat('op', ';')) {}
      funcs[name] = { name: name, params: params, locals: locals, instance: instance, globals: globals, body: body, line: line };
    }
    function block() {
      var items = [];
      for (;;) {
        while (eat('op', ';')) {}
        if (at('op', ')') || at('eof')) break;
        if (at('kw', 'function')) { func(); continue; }
        items.push(assign());
        if (!at('op', ';')) break;
      }
      while (eat('op', ';')) {}
      return items.length === 1 ? items[0] : { k: 'seq', items: items };
    }
    function arg() {
      var items = [assign()];
      while (at('op', ';')) {
        p++;
        if (at('op', ')') || at('op', ',')) break;
        items.push(assign());
      }
      return items.length === 1 ? items[0] : { k: 'seq', items: items };
    }
    function assign() {
      var lhs = ternary();
      var t = peek();
      if (t.k === 'op' && ASSIGN[t.v]) {
        p++;
        return { k: 'assign', op: t.v, lhs: lhs, rhs: assign(), line: t.line };
      }
      return lhs;
    }
    function ternary() {
      var c = logic();
      if (eat('op', '?')) {
        var a = at('op', ':') ? { k: 'num', v: 0 } : assign();
        var b = null;
        if (eat('op', ':')) b = assign();
        return { k: 'if', c: c, a: a, b: b };
      }
      return c;
    }
    function logic() {
      var n = cmp();
      while (at('op', '&&') || at('op', '||')) n = { k: 'logic', op: toks[p++].v, a: n, b: cmp() };
      return n;
    }
    function cmp() {
      var n = bit();
      while (peek().k === 'op' && CMP[peek().v]) n = { k: 'bin', op: toks[p++].v, a: n, b: bit() };
      return n;
    }
    function bit() {
      var n = add();
      while (at('op', '|') || at('op', '&') || at('op', '~')) n = { k: 'bin', op: toks[p++].v, a: n, b: add() };
      return n;
    }
    function add() {
      var n = mul();
      while (at('op', '+') || at('op', '-')) n = { k: 'bin', op: toks[p++].v, a: n, b: mul() };
      return n;
    }
    function mul() {
      var n = shift();
      while (at('op', '*') || at('op', '/')) n = { k: 'bin', op: toks[p++].v, a: n, b: shift() };
      return n;
    }
    function shift() {
      var n = mod();
      while (at('op', '<<') || at('op', '>>')) n = { k: 'bin', op: toks[p++].v, a: n, b: mod() };
      return n;
    }
    function mod() {
      var n = pow();
      while (at('op', '%')) { p++; n = { k: 'bin', op: '%', a: n, b: pow() }; }
      return n;
    }
    function pow() {
      var n = unary();
      if (at('op', '^')) { p++; return { k: 'bin', op: '^', a: n, b: pow() }; }
      return n;
    }
    function unary() {
      var t = peek();
      if (t.k === 'op' && (t.v === '!' || t.v === '-' || t.v === '+')) { p++; return { k: 'un', op: t.v, a: unary() }; }
      return postfix();
    }
    function postfix() {
      var n = primary();
      while (at('op', '[')) {
        p++;
        var idx = at('op', ']') ? { k: 'num', v: 0 } : assign();
        expect('op', ']');
        n = { k: 'index', base: n, idx: idx };
      }
      return n;
    }
    function primary() {
      var t = toks[p++];
      switch (t.k) {
        case 'num': return { k: 'num', v: t.v };
        case 'str': return { k: 'strlit', v: t.v };
        case 'nstr': return { k: 'nstr', v: t.v };
        case 'tmpstr': return { k: 'tmpstr', id: p };
        case 'op':
          if (t.v === '(') { var b = block(); expect('op', ')'); return b; }
          break;
        case 'id':
          if (at('op', '(')) {
            p++;
            var args = [];
            while (!at('op', ')')) { args.push(arg()); if (!eat('op', ',')) break; }
            expect('op', ')');
            if ((t.v === 'while' || t.v === 'loop') && at('op', '(')) {
              p++; var body = block(); expect('op', ')');
              args.push(body);
            }
            return { k: 'call', name: t.v, args: args, line: t.line };
          }
          return { k: 'var', name: t.v, line: t.line };
      }
      throw new EelError('unexpected ' + (t.v !== undefined ? t.v : t.k), t.line);
    }
    return program();
  }

  // ---------------------------------------------------------- compiler ----
  // Builtins that are plain maths: name -> JS expression template.
  var MATH = {
    sin: 'Math.sin', cos: 'Math.cos', tan: 'Math.tan', asin: 'Math.asin', acos: 'Math.acos',
    atan: 'Math.atan', atan2: 'Math.atan2', sqrt: 'H.sqrt', exp: 'Math.exp', log: 'Math.log',
    log10: 'Math.log10', abs: 'Math.abs', floor: 'Math.floor', ceil: 'Math.ceil',
    min: 'Math.min', max: 'Math.max', pow: 'Math.pow', sign: 'H.sign', invsqrt: 'H.invsqrt',
    sqr: 'H.sqr', rand: 'H.rand', exp2: 'H.exp2'
  };

  function Compiler(slotsOf) {
    this.slots = slotsOf;          // name -> index into v
    this.funcs = {};
    this.compiledFuncs = {};
    this.funcCode = [];
    this.strConsts = [];
    this.temps = 0;
    this.gfx = false;              // compile gfx_* calls for a host to draw
  }
  Compiler.prototype.slot = function (name) {
    var s = this.slots[name];
    if (s === undefined) { s = this.slots.__count++; this.slots[name] = s; }
    return s;
  };

  Compiler.prototype.compileSection = function (code, firstLine) {
    var ast = parse(lex(code, firstLine), this.funcs);
    var saveTemps = this.temps;
    this.temps = 0;
    var body = this.stmts(ast, null, true, 'r');
    var temps = this.tempDecl();
    this.temps = saveTemps;
    return 'var r = 0;' + temps + body + 'return r;';
  };
  Compiler.prototype.tempDecl = function () {
    if (!this.temps) return '';
    var names = [];
    for (var i = 1; i <= this.temps; i++) names.push('t' + i);
    return 'var ' + names.join(', ') + ';';
  };
  Compiler.prototype.temp = function () { this.temps++; return 't' + this.temps; };

  // Names inside a function: parameters, statics, instance variables, or
  // globals. A function called as ns.f() keeps its instance() variables, and
  // anything it names as this.x, in ns: ns.x (REAPER's pseudo-objects).
  Compiler.prototype.ref = function (name, ctx) {
    if (ctx) {
      var pi = ctx.fn.params.indexOf(name);
      if (pi >= 0) return 'p' + pi;
      if (ctx.fn.locals.indexOf(name) >= 0) return 'v[' + this.slot(ctx.fn.name + '::' + name) + ']';
      if (ctx.fn.instance.indexOf(name) >= 0) return 'v[' + this.slot(ctx.ns ? ctx.ns + '.' + name : name) + ']';
    }
    if (name.indexOf('this.') === 0) return 'v[' + this.slot(resolveThis(name, ctx)) + ']';
    return 'v[' + this.slot(name) + ']';
  };
  // this.x, this.child.x: the namespace the function was called in.
  function resolveThis(name, ctx) {
    var ns = ctx && ctx.ns ? ctx.ns : '';
    if (name === 'this') return ns;
    return ns ? ns + '.' + name.slice(5) : name.slice(5);
  }

  function hasControl(n) {
    if (!n || typeof n !== 'object') return false;
    if (n.k === 'call' && (n.name === 'loop' || n.name === 'while')) return true;
    for (var key in n) {
      var c = n[key];
      if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) if (hasControl(c[i])) return true; }
      else if (c && typeof c === 'object' && c.k && hasControl(c)) return true;
    }
    return false;
  }

  // Statements computing `n`; the value lands in `target` when wanted.
  Compiler.prototype.stmts = function (n, ctx, want, target) {
    if (n.k === 'seq') {
      var out = '';
      if (!n.items.length) return want ? target + ' = 0;' : '';
      for (var i = 0; i < n.items.length; i++) {
        var last = i === n.items.length - 1;
        out += this.stmts(n.items[i], ctx, want && last, target);
      }
      return out;
    }
    if (n.k === 'call' && n.name === 'loop') {
      var cnt = this.temp(), ii = this.temp();
      var s = cnt + ' = Math.min(' + MAXLOOP + ', Math.trunc(' + this.expr(n.args[0], ctx) + ')); ';
      if (want) s += target + ' = 0; ';
      s += 'for (' + ii + ' = 0; ' + ii + ' < ' + cnt + '; ' + ii + '++) {' + (n.args[1] ? this.stmts(n.args[1], ctx, want, target) : '') + '}';
      return s;
    }
    if (n.k === 'call' && n.name === 'while') {
      var guard = this.temp(), r = this.temp();
      if (n.args.length >= 2) {
        return guard + ' = 0; ' + (want ? target + ' = 0; ' : '') + 'while (Math.abs(' + this.expr(n.args[0], ctx) + ') >= ' + EPS + ' && ' + guard + '++ < ' + MAXLOOP + ') {' +
          this.stmts(n.args[1], ctx, want, target) + '}';
      }
      return guard + ' = 0; do {' + this.stmts(n.args[0], ctx, true, r) + (want ? target + ' = ' + r + ';' : '') +
        '} while (Math.abs(' + r + ') >= ' + EPS + ' && ++' + guard + ' < ' + MAXLOOP + ');';
    }
    if (n.k === 'if' && hasControl(n)) {
      var o = 'if (Math.abs(' + this.expr(n.c, ctx) + ') >= ' + EPS + ') {' + this.stmts(n.a, ctx, want, target) + '}';
      if (n.b) o += ' else {' + this.stmts(n.b, ctx, want, target) + '}';
      else if (want) o += ' else { ' + target + ' = 0; }';
      return o;
    }
    var e = this.expr(n, ctx);
    return (want ? target + ' = ' + e : e) + ';';
  };

  function T(e) { return '(Math.abs(' + e + ') >= ' + EPS + ')'; }

  Compiler.prototype.expr = function (n, ctx) {
    var self = this;
    // A loop inside an expression: the statements holding it run in a
    // closure. Only a loop, a sequence or a conditional is one; anything else
    // compiles its parts, each of which takes its own closure if it needs one.
    if (hasControl(n) && (n.k === 'seq' || n.k === 'if' || (n.k === 'call' && (n.name === 'loop' || n.name === 'while')))) {
      return '(() => { var rr = 0; ' + this.stmts(n, ctx, true, 'rr') + ' return rr; })()';
    }
    switch (n.k) {
      case 'raw': return n.code;
      case 'num': return n.v < 0 ? '(' + String(n.v) + ')' : String(n.v);
      case 'strlit': return String(this.strConst(n.v));
      case 'nstr': return 'S.named(' + JSON.stringify(n.v) + ')';
      case 'tmpstr': return 'S.tempStr(' + n.id + ')';
      case 'var': return this.varRead(n.name, ctx);
      case 'seq': {
        if (!n.items.length) return '0';
        return '(' + n.items.map(function (x) { return self.expr(x, ctx); }).join(', ') + ')';
      }
      case 'if':
        return '(' + T(this.expr(n.c, ctx)) + ' ? ' + this.expr(n.a, ctx) + ' : ' + (n.b ? this.expr(n.b, ctx) : '0') + ')';
      case 'logic': {
        var a = T(this.expr(n.a, ctx)), b = T(this.expr(n.b, ctx));
        return '((' + a + (n.op === '&&' ? ' && ' : ' || ') + b + ') ? 1 : 0)';
      }
      case 'un':
        if (n.op === '!') return '(' + T(this.expr(n.a, ctx)) + ' ? 0 : 1)';
        if (n.op === '-') return '(-' + this.expr(n.a, ctx) + ')';
        return this.expr(n.a, ctx);
      case 'bin': return this.binary(n.op, this.expr(n.a, ctx), this.expr(n.b, ctx));
      case 'index': return this.memRead(n, ctx);
      case 'assign': return this.assignment(n, ctx);
      case 'call': return this.call(n, ctx);
    }
    throw new EelError('cannot compile ' + n.k);
  };

  Compiler.prototype.binary = function (op, a, b) {
    switch (op) {
      case '+': return '(' + a + ' + ' + b + ')';
      case '-': return '(' + a + ' - ' + b + ')';
      case '*': return '(' + a + ' * ' + b + ')';
      case '/': return '(' + a + ' / ' + b + ')';
      case '%': return 'H.mod(' + a + ', ' + b + ')';
      case '^': return 'Math.pow(' + a + ', ' + b + ')';
      case '<<': return 'H.shl(' + a + ', ' + b + ')';
      case '>>': return 'H.shr(' + a + ', ' + b + ')';
      case '|': return 'H.bor(' + a + ', ' + b + ')';
      case '&': return 'H.band(' + a + ', ' + b + ')';
      case '~': return 'H.bxor(' + a + ', ' + b + ')';
      case '==': return '(Math.abs(' + a + ' - ' + b + ') < ' + EPS + ' ? 1 : 0)';
      case '!=': return '(Math.abs(' + a + ' - ' + b + ') < ' + EPS + ' ? 0 : 1)';
      case '===': return '(' + a + ' === ' + b + ' ? 1 : 0)';
      case '!==': return '(' + a + ' !== ' + b + ' ? 1 : 0)';
      case '<': case '>': case '<=': case '>=': return '(' + a + ' ' + op + ' ' + b + ' ? 1 : 0)';
    }
    throw new EelError('bad operator ' + op);
  };

  Compiler.prototype.strConst = function (s) {
    var i = this.strConsts.indexOf(s);
    if (i < 0) { i = this.strConsts.length; this.strConsts.push(s); }
    return 10000 + i;
  };

  Compiler.prototype.varRead = function (name, ctx) {
    if (name === 'gmem') return 'S.gmemBase';
    return this.ref(name, ctx);
  };

  Compiler.prototype.address = function (n, ctx) {
    if (n.base.k === 'var' && n.base.name === 'gmem') return { gmem: true, addr: this.expr(n.idx, ctx) };
    var base = this.expr(n.base, ctx);
    var idx = n.idx.k === 'num' && n.idx.v === 0 ? null : this.expr(n.idx, ctx);
    return { gmem: false, addr: idx === null ? base : '(' + base + ' + ' + idx + ')' };
  };
  Compiler.prototype.memRead = function (n, ctx) {
    var a = this.address(n, ctx);
    if (a.gmem) return 'S.grd(' + a.addr + ')';
    // Inline: a typed array read out of range is undefined, which || makes 0.
    return '(M[(' + a.addr + ' + ' + EPS + ') | 0] || 0)';
  };

  var COMPOUND = { '+=': '+', '-=': '-', '*=': '*', '/=': '/', '%=': '%', '^=': '^', '|=': '|', '&=': '&', '~=': '~', '<<=': '<<', '>>=': '>>' };

  Compiler.prototype.assignment = function (n, ctx) {
    var self = this;
    var lhs = n.lhs, rhs = this.expr(n.rhs, ctx);
    function value(cur) { return n.op === '=' ? rhs : self.binary(COMPOUND[n.op], cur, rhs); }
    if (lhs.k === 'var') {
      var r = this.ref(lhs.name, ctx);
      return '(' + r + ' = ' + value(r) + ')';
    }
    if (lhs.k === 'index') {
      var a = this.address(lhs, ctx), t = this.temp();
      var rdf = a.gmem ? 'S.grd' : 'rd', wrf = a.gmem ? 'S.gwr' : 'wr';
      return '(' + t + ' = ' + a.addr + ', ' + wrf + '(' + t + ', ' + value(rdf + '(' + t + ')') + '))';
    }
    if (lhs.k === 'if') {
      var tv = this.temp();
      var asg = function (side) { return side ? self.assignment({ k: 'assign', op: '=', lhs: side, rhs: { k: 'raw', code: tv } }, ctx) : '0'; };
      if (n.op !== '=') throw new EelError('compound assignment to a conditional is not supported');
      return '(' + tv + ' = ' + rhs + ', ' + T(this.expr(lhs.c, ctx)) + ' ? ' + asg(lhs.a) + ' : ' + asg(lhs.b) + ')';
    }
    if (lhs.k === 'nstr' || lhs.k === 'strlit') {
      return 'S.strcpy(' + this.expr(lhs, ctx) + ', ' + rhs + ')';
    }
    if (lhs.k === 'call' && lhs.name === 'slider') {
      var si = this.temp();
      return '(' + si + ' = ' + this.expr(lhs.args[0], ctx) + ', S.setSliderByIndex(' + si + ', ' + value('S.sliderByIndex(' + si + ')') + '))';
    }
    if (lhs.k === 'seq' && lhs.items.length) {
      var head = lhs.items.slice(0, -1).map(function (x) { return self.expr(x, ctx); });
      return '(' + head.concat([this.assignment({ k: 'assign', op: n.op, lhs: lhs.items[lhs.items.length - 1], rhs: n.rhs }, ctx)]).join(', ') + ')';
    }
    throw new EelError('cannot assign to ' + lhs.k);
  };

  // A variable passed by reference (midirecv, file_var): its JS lvalue.
  Compiler.prototype.lvalue = function (n, ctx) {
    if (n.k === 'var') return this.ref(n.name, ctx);
    return null;
  };

  Compiler.prototype.call = function (n, ctx) {
    var self = this, name = n.name, args = n.args;
    function A(i) { return args[i] === undefined ? '0' : self.expr(args[i], ctx); }
    function all() { return args.map(function (x) { return self.expr(x, ctx); }).join(', '); }
    if (MATH[name]) return MATH[name] + '(' + all() + ')';
    switch (name) {
      case 'midirecv': {
        var lv = args.map(function (x) { return self.lvalue(x, ctx); });
        var sets = [];
        for (var i = 0; i < lv.length; i++) {
          if (!lv[i]) continue;
          var src = lv.length >= 4 ? 'S.mr[' + i + ']' : (i === 2 ? '(S.mr[2] + S.mr[3] * 256)' : 'S.mr[' + i + ']');
          sets.push(lv[i] + ' = ' + src);
        }
        return '(S.midirecv() ? (' + (sets.length ? sets.join(', ') + ', ' : '') + 'S.mr[1]) : 0)';
      }
      case 'midisend':
        if (args.length >= 4) return 'S.midisend(' + A(0) + ', ' + A(1) + ', ' + A(2) + ', ' + A(3) + ')';
        return 'S.midisend3(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'midisend_buf': return 'S.midisendBuf(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'midisyx': return 'S.midisendBuf(' + A(0) + ', ' + A(1) + ', ' + A(2) + ')';
      case 'file_var': {
        var fv = this.lvalue(args[1], ctx);
        if (!fv) return 'S.fileVar(' + A(0) + ', ' + A(1) + ')';
        return '(' + fv + ' = S.fileVar(' + A(0) + ', ' + fv + '))';
      }
      case 'file_riff': {
        // channels and sample rate come back through the arguments
        var nc = this.lvalue(args[1], ctx), fr = this.lvalue(args[2], ctx);
        var t0 = this.temp();
        return '(' + t0 + ' = S.fileRiff(' + A(0) + ')' + (nc ? ', ' + nc + ' = S.riff[0]' : '') + (fr ? ', ' + fr + ' = S.riff[1]' : '') + ', ' + t0 + ')';
      }
      case 'slider': return 'S.sliderByIndex(' + A(0) + ')';
      case 'loop': case 'while':
        return '(() => { var rr = 0; ' + this.stmts(n, ctx, true, 'rr') + ' return rr; })()';
      case 'match': case 'matchi': {
        var refs = args.slice(2).map(function (x) { return self.lvalue(x, ctx); });
        var call = 'S.match(' + (name === 'matchi' ? 'true' : 'false') + ', ' + A(0) + ', ' + A(1) + ')';
        if (!refs.length) return call;
        var tm = this.temp();
        var assigns = refs.map(function (r, k) { return r ? r + ' = S.matchOut[' + k + ']' : ''; }).filter(Boolean);
        return '(' + tm + ' = ' + call + ', ' + tm + ' ? (' + (assigns.length ? assigns.join(', ') + ', ' : '') + '1) : 0)';
      }
    }
    if (this.funcs[name]) return this.userCall(this.funcs[name], args, ctx, '');
    if (name.indexOf('.') > 0) {
      var base = name.slice(name.lastIndexOf('.') + 1), prefix = name.slice(0, name.lastIndexOf('.'));
      if (this.funcs[base]) return this.userCall(this.funcs[base], args, ctx, prefix === 'this' || prefix.indexOf('this.') === 0 ? resolveThis(prefix, ctx) : prefix);
    }
    if (/^gfx_|^mouse_/.test(name)) {
      if (!this.gfx) return '(' + (args.length ? all() + ', ' : '') + '0)';
      // Width and height come back through the arguments, as file_riff's do.
      if (name === 'gfx_measurestr' || name === 'gfx_measurechar' || name === 'gfx_getimgdim') {
        var mw = this.lvalue(args[1] || { k: 'num', v: 0 }, ctx), mh = this.lvalue(args[2] || { k: 'num', v: 0 }, ctx);
        var tg = this.temp();
        return '(' + tg + ' = S.call(' + JSON.stringify(name) + ', ' + A(0) + ')' + (mw ? ', ' + mw + ' = S.gm[0]' : '') +
               (mh ? ', ' + mh + ' = S.gm[1]' : '') + ', ' + tg + ')';
      }
    }
    return 'S.call(' + JSON.stringify(name) + (args.length ? ', ' + all() : '') + ')';
  };

  // One compiled copy per function and namespace, as EEL2 does: a.f() and
  // b.f() are two functions, each with its own instance variables.
  Compiler.prototype.userCall = function (fn, args, ctx, ns) {
    var self = this;
    ns = ns || '';
    if (args.length !== fn.params.length && !(args.length === 1 && fn.params.length === 0)) {
      // EEL2 refuses the wrong number of arguments at compile time.
      throw new EelError(fn.name + '() takes ' + fn.params.length + ' arguments, given ' + args.length);
    }
    var jsName = 'F_' + fn.name.replace(/\./g, '_') + (ns ? '$' + ns.replace(/\./g, '$') : '');
    var key = fn.name + '@' + ns;
    if (!this.compiledFuncs[key]) {
      this.compiledFuncs[key] = true;
      var saved = this.temps;
      this.temps = 0;
      var body = this.stmts(fn.body, { fn: fn, ns: ns }, true, 'r');
      var temps = this.tempDecl();
      this.temps = saved;
      var params = fn.params.map(function (_, i) { return 'p' + i; });
      this.funcCode.push('function ' + jsName + '(' + params.join(', ') + ') { var r = 0;' + temps + body + ' return r; }');
    }
    return jsName + '(' + args.slice(0, fn.params.length).map(function (x) { return self.expr(x, ctx); }).join(', ') + ')';
  };

  // ----------------------------------------------------------- helpers ----
  function i64(x) { return Math.trunc(x); }
  function bigOp(a, b, f) { return Number(BigInt.asIntN(64, f(BigInt(i64(a)), BigInt(i64(b))))); }
  var H = {
    sqrt: function (x) { return Math.sqrt(Math.abs(x)); },
    sign: function (x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); },
    invsqrt: function (x) { return 1 / Math.sqrt(x); },
    sqr: function (x) { return x * x; },
    exp2: function (x) { return Math.pow(2, x); },
    rand: function (x) { return Math.random() * (x === undefined ? 1 : x); },
    mod: function (a, b) {
      var ib = Math.trunc(Math.abs(b));
      return ib ? Math.trunc(Math.abs(a)) % ib : 0;
    },
    shl: function (a, b) { return bigOp(a, b, function (x, y) { return x << (y & 63n); }); },
    shr: function (a, b) { return bigOp(a, b, function (x, y) { return x >> (y & 63n); }); },
    bor: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) | i64(b));
      return bigOp(a, b, function (x, y) { return x | y; });
    },
    band: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) & i64(b));
      return bigOp(a, b, function (x, y) { return x & y; });
    },
    bxor: function (a, b) {
      if (Math.abs(a) < 2147483648 && Math.abs(b) < 2147483648) return (i64(a) ^ i64(b));
      return bigOp(a, b, function (x, y) { return x ^ y; });
    }
  };

  // C's %f: the double's exact decimal value, rounded half to even.
  var F64 = new Float64Array(1), U32 = new Uint32Array(F64.buffer);
  function toFixedC(x, f) {
    if (!isFinite(x)) return String(x);
    var neg = x < 0; F64[0] = Math.abs(x);
    var hi = U32[1], lo = U32[0], exp = (hi >>> 20) & 0x7ff;
    var mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
    if (exp === 0) exp = 1; else mant |= 1n << 52n;
    var e = exp - 1075, D, sc;
    if (e >= 0) { D = mant << BigInt(e); sc = 0; } else { D = mant * (5n ** BigInt(-e)); sc = -e; }
    var q;
    if (f >= sc) q = D * (10n ** BigInt(f - sc));
    else {
      var div = 10n ** BigInt(sc - f); q = D / div; var r2 = (D % div) * 2n;
      if (r2 > div || (r2 === div && (q & 1n) === 1n)) q += 1n;
    }
    var s = q.toString();
    if (f > 0) { while (s.length <= f) s = '0' + s; s = s.slice(0, s.length - f) + '.' + s.slice(s.length - f); }
    return (neg && /[1-9]/.test(s) ? '-' : (neg ? '-' : '')) + s;
  }

  // EEL2's sprintf, on doubles.
  function eelFormat(fmt, values) {
    var vi = 0;
    return fmt.replace(/%([-+ 0#]*)(\d*)(?:\.(\d+))?([dixXfgecs%])/g, function (all, flags, width, prec, conv) {
      if (conv === '%') return '%';
      var v = values[vi++], s;
      if (v === undefined) v = 0;
      switch (conv) {
        case 'd': case 'i': s = String(Math.trunc(v.num !== undefined ? v.num : v)); break;
        case 'x': s = (Math.trunc(v) >>> 0).toString(16); break;
        case 'X': s = (Math.trunc(v) >>> 0).toString(16).toUpperCase(); break;
        case 'f': s = toFixedC(Number(v), prec === undefined ? 6 : Number(prec)); break;
        case 'e': s = Number(v).toExponential(prec === undefined ? 6 : Number(prec)); break;
        case 'g': s = String(Number(Number(v).toPrecision(prec === undefined ? 6 : Math.max(1, Number(prec))))); break;
        case 'c': s = String.fromCharCode(Math.trunc(v)); break;
        case 's': s = v.str !== undefined ? v.str : String(v); break;
      }
      if (flags.indexOf('+') >= 0 && conv !== 's' && Number(v) >= 0) s = '+' + s;
      var w = Number(width || 0);
      while (s.length < w) s = flags.indexOf('-') >= 0 ? s + ' ' : (flags.indexOf('0') >= 0 && conv !== 's' ? '0' + s : ' ' + s);
      return s;
    });
  }

  // ---------------------------------------------------------- instance ----
  function JSFX(text, opts) {
    opts = opts || {};
    this.file = parseFile(text, opts.readImport);
    this.srate = opts.sampleRate || 48000;
    this.slots = { __count: 0 };
    var self = this;
    var C = new Compiler(this.slots);
    C.gfx = !!opts.gfx;
    // Predeclare what the host reads and writes.
    ['srate', 'samplesblock', 'tempo', 'play_state', 'play_position', 'beat_position', 'ts_num', 'ts_denom',
     'num_ch', 'trigger', 'pdc_delay', 'pdc_bot_ch', 'pdc_top_ch', 'pdc_midi', 'ext_noinit', 'ext_nodenorm',
     'ext_midi_bus', 'midi_bus', 'gfx_ext_retina'].forEach(function (n) { C.slot(n); });
    for (var c = 0; c < 64; c++) C.slot('spl' + c);
    for (var s = 1; s <= 64; s++) C.slot('slider' + s);
    this.file.sliders.forEach(function (sl) { C.slot(sl.variable); });
    if (C.gfx) ['gfx_r', 'gfx_g', 'gfx_b', 'gfx_a', 'gfx_a2', 'gfx_x', 'gfx_y', 'gfx_w', 'gfx_h', 'gfx_texth', 'gfx_mode', 'gfx_clear',
                'gfx_dest', 'gfx_ext_flags', 'mouse_x', 'mouse_y', 'mouse_cap', 'mouse_wheel', 'mouse_hwheel'].forEach(function (n) { C.slot(n); });

    var sections = {};
    ['init', 'slider', 'block', 'sample', 'serialize'].concat(C.gfx ? ['gfx'] : []).forEach(function (name) {
      var parts = self.file.sections[name];
      if (!parts.length) return;
      sections[name] = parts.map(function (part) { return C.compileSection(part.code, part.line); });
    });
    // @gfx is parsed for its functions only, so @init code that calls a
    // helper defined there still compiles.
    if (!C.gfx) this.file.sections.gfx.forEach(function (part) {
      try { parse(lex(part.code, part.line), C.funcs); } catch (e) { /* the window is not run */ }
    });

    // Room for names a later eval() adds: the generated code holds on to v.
    this.v = new Float64Array(this.slots.__count + 4096);
    this.strConsts = C.strConsts;
    var src = [];
    src.push('"use strict";');
    // Memory is one Float64Array that doubles when written past its end, up
    // to EEL2's 8M words; rd and wr sit beside it so V8 can inline them.
    src.push('var v = S.v, M = new Float64Array(' + BLOCK + ');');
    src.push('function rd(a) { var i = (a + ' + EPS + ') | 0; return (i >= 0 && i < M.length) ? M[i] : 0; }');
    src.push('function wr(a, x) { var i = (a + ' + EPS + ') | 0; if (i >= 0 && i < M.length) { M[i] = x; return x; } return grow(i, x); }');
    src.push('function grow(i, x) { if (i < 0 || i >= ' + (BLOCK * NBLOCKS) + ') return x; var n = M.length; while (n <= i) n *= 2;' +
             ' var N = new Float64Array(Math.min(n, ' + (BLOCK * NBLOCKS) + ')); N.set(M); M = N; M[i] = x; return x; }');
    src.push('S.rd = rd; S.wr = wr; S.clearMem = function () { M = new Float64Array(' + BLOCK + '); };');
    // Code compiled later (eval) runs in this scope, beside M, v and the helpers.
    src.push('S.evalIn = function (code) { return eval(code); };');
    src.push(C.funcCode.join('\n'));
    Object.keys(sections).forEach(function (name) {
      src.push('S.sec_' + name + ' = [' + sections[name].map(function (b) { return 'function () {' + b + '}'; }).join(',\n') + '];');
    });
    this.code = src.join('\n');
    this.reset();
    new Function('S', 'H', this.code)(this, H);
  }

  JSFX.prototype.reset = function () {
    this.v.fill(0);
    this.mem = new Array(NBLOCKS);
    this.gmem = NS.sharedGmem || (NS.sharedGmem = {});
    this.gmemName = (/gmem=(\S+)/.exec(this.file.options) || [])[1] || '';
    this.strings = {};
    this.namedIds = {};
    this.nextNamed = 90000;
    this.midiIn = []; this.midiInPos = 0; this.midiOut = [];
    this.mr = [0, 0, 0, 0];
    this.matchOut = [];
    this.serial = null;
    this.blockCount = 0;
    this.sliderDirty = true;
    this.sampleFrame = 0;
    var self = this;
    if (this.clearMem) this.clearMem();
    this.file.sliders.forEach(function (sl) { self.v[self.slots[sl.variable]] = sl.def; });
  };

  JSFX.prototype.slot = function (name) { return this.slots[name.toLowerCase()]; };
  JSFX.prototype.getVar = function (name) { var s = this.slot(name); return s === undefined ? 0 : this.v[s]; };
  JSFX.prototype.setVar = function (name, val) { var s = this.slot(name); if (s !== undefined) this.v[s] = val; };

  JSFX.prototype.sliderVar = function (n) {
    for (var i = 0; i < this.file.sliders.length; i++) if (this.file.sliders[i].index === n) return this.file.sliders[i].variable;
    return 'slider' + n;
  };
  JSFX.prototype.sliderByIndex = function (n) { return this.v[this.slots[this.sliderVar(Math.trunc(n))]] || 0; };
  JSFX.prototype.setSliderByIndex = function (n, val) { this.v[this.slots[this.sliderVar(Math.trunc(n))]] = val; return val; };
  JSFX.prototype.getSlider = function (n) { return this.sliderByIndex(n); };
  JSFX.prototype.setSlider = function (n, val) {
    this.setSliderByIndex(n, val);
    this.sliderDirty = true;
  };

  JSFX.prototype.runSection = function (name) {
    var list = this['sec_' + name];
    if (!list) return 0;
    var r = 0;
    for (var i = 0; i < list.length; i++) r = list[i]();
    return r;
  };

  JSFX.prototype.setTime = function (t) {
    var v = this.v, s = this.slots;
    if (t.tempo !== undefined) v[s.tempo] = t.tempo;
    if (t.playState !== undefined) v[s.play_state] = t.playState;
    if (t.beat !== undefined) v[s.beat_position] = t.beat;
    if (t.seconds !== undefined) v[s.play_position] = t.seconds;
    if (t.num !== undefined) v[s.ts_num] = t.num;
    if (t.den !== undefined) v[s.ts_denom] = t.den;
  };

  JSFX.prototype.init = function (sampleRate) {
    if (sampleRate) this.srate = sampleRate;
    var keep = this.file.sliders.map(function (sl) { return this.v[this.slots[sl.variable]]; }, this);
    this.reset();
    this.file.sliders.forEach(function (sl, i) { this.v[this.slots[sl.variable]] = keep[i]; }, this);
    var v = this.v, s = this.slots;
    v[s.srate] = this.srate;
    v[s.num_ch] = Math.max(this.file.inPins.length, this.file.outPins.length);
    v[s.tempo] = v[s.tempo] || 120; v[s.ts_num] = v[s.ts_num] || 4; v[s.ts_denom] = v[s.ts_denom] || 4;
    this.runSection('init');
    this.runSection('slider');
    this.sliderDirty = false;
    this.initialised = true;
  };

  /* One block: `inputs`/`outputs` are arrays of Float32Array per channel (or
   * null for a MIDI-only device), `midi` is [{offset, data:[b1,b2,b3]}]
   * sorted by offset. Returns the MIDI sent, with offsets. */
  JSFX.prototype.process = function (n, inputs, outputs, midi) {
    if (!this.initialised) this.init();
    var v = this.v, s = this.slots;
    if (this.sliderDirty) { this.sliderDirty = false; this.runSection('slider'); }
    v[s.samplesblock] = n;
    this.midiIn = midi || [];
    this.midiInPos = 0;
    this.midiOut = [];
    this.runSection('block');
    var sec = this.sec_sample;
    if (sec && sec.length) {
      var nIn = inputs ? inputs.length : 0, nOut = outputs ? outputs.length : 0;
      var nch = Math.max(nIn, nOut, 2);
      var spl = [];
      for (var c = 0; c < nch; c++) spl.push(s['spl' + c]);
      for (var i = 0; i < n; i++) {
        this.sampleFrame = i;
        for (var ci = 0; ci < nch; ci++) v[spl[ci]] = ci < nIn && inputs[ci] ? inputs[ci][i] : 0;
        for (var k = 0; k < sec.length; k++) sec[k]();
        for (var co = 0; co < nOut; co++) if (outputs[co]) outputs[co][i] = v[spl[co]];
      }
    } else if (outputs && inputs) {
      for (var ch = 0; ch < outputs.length; ch++) if (outputs[ch] && inputs[ch]) outputs[ch].set(inputs[ch]);
    }
    // MIDI a plug-in did not read passes through, as in REAPER.
    for (var r = this.midiInPos; r < this.midiIn.length; r++) this.midiOut.push(this.midiIn[r]);
    this.blockCount++;
    var out = this.midiOut;
    out.sort(function (a, b) { return a.offset - b.offset; });
    return out;
  };

  // ------------------------------------------------------- the host API --
  JSFX.prototype.midirecv = function () {
    if (this.midiInPos >= this.midiIn.length) return 0;
    var ev = this.midiIn[this.midiInPos++];
    this.mr[0] = ev.offset; this.mr[1] = ev.data[0]; this.mr[2] = ev.data[1] || 0; this.mr[3] = ev.data[2] || 0;
    return 1;
  };
  JSFX.prototype.midisend = function (offset, b1, b2, b3) {
    this.midiOut.push({ offset: Math.max(0, Math.trunc(offset)), data: [Math.trunc(b1) & 255, Math.trunc(b2) & 127, Math.trunc(b3) & 127] });
    return b1;
  };
  JSFX.prototype.midisend3 = function (offset, b1, b23) {
    b23 = Math.trunc(b23);
    return this.midisend(offset, b1, b23 & 255, (b23 >> 8) & 255);
  };
  JSFX.prototype.midisendBuf = function (offset, buf, len) {
    var data = [];
    for (var i = 0; i < len; i++) data.push(Math.trunc(this.rd(buf + i)) & 255);
    this.midiOut.push({ offset: Math.max(0, Math.trunc(offset)), data: data });
    return len;
  };

  JSFX.prototype.grd = function (a) { var g = this.gmem[this.gmemName]; if (!g) return 0; var i = (a + EPS) | 0; return g[i] || 0; };
  JSFX.prototype.gwr = function (a, val) {
    var g = this.gmem[this.gmemName] || (this.gmem[this.gmemName] = {});
    g[(a + EPS) | 0] = val; return val;
  };

  // Strings: literals are 10000+, named strings 90000+, slots 0-1023 free.
  JSFX.prototype.str = function (id) {
    id = Math.trunc(id);
    if (id >= 10000 && id < 90000) return this.strConsts[id - 10000] || '';
    return this.strings[id] || '';
  };
  JSFX.prototype.setStr = function (id, s) { this.strings[Math.trunc(id)] = s; return id; };
  JSFX.prototype.named = function (name) {
    var id = this.namedIds[name];
    if (id === undefined) { id = this.namedIds[name] = this.nextNamed++; this.strings[id] = ''; }
    return id;
  };
  JSFX.prototype.tempStr = function (site) { var id = 200000 + site; if (this.strings[id] === undefined) this.strings[id] = ''; return id; };
  JSFX.prototype.strcpy = function (d, s) { return this.setStr(d, this.str(s)); };
  JSFX.prototype.match = function (ci, pat, sid) {
    var p = this.str(pat), s = this.str(sid);
    var re = '^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
    return new RegExp(re, ci ? 'i' : '').test(s) ? 1 : 0;
  };

  JSFX.prototype.riff = [0, 0];
  JSFX.prototype.fileRiff = function (h) {
    var f = this.files && this.files[Math.trunc(h)];
    this.riff = f ? [f.channels, f.rate] : [0, 0];
    return f ? 1 : 0;
  };
  // One frame of @gfx, drawn by `host`: an object with a method per gfx_*
  // function (each called with the JSFX first), as the Ableton devices give.
  // `w`, `h` and `mouse` ({x, y, cap, wheel, hwheel}) are what REAPER sets.
  JSFX.prototype.runGfx = function (host, w, h, mouse) {
    if (!this.sec_gfx) return 0;
    if (!this.initialised) this.init();
    var v = this.v, s = this.slots;
    this.gfxHost = host;
    v[s.gfx_w] = w; v[s.gfx_h] = h;
    if (mouse) {
      v[s.mouse_x] = mouse.x; v[s.mouse_y] = mouse.y; v[s.mouse_cap] = mouse.cap;
      if (mouse.wheel) v[s.mouse_wheel] += mouse.wheel;
      if (mouse.hwheel) v[s.mouse_hwheel] += mouse.hwheel;
    }
    return this.runSection('gfx');
  };
  JSFX.prototype.gm = [0, 0];

  JSFX.prototype.call = function (name) {
    var a = Array.prototype.slice.call(arguments, 1);
    if (this.gfxHost && this.gfxHost[name]) return +this.gfxHost[name].apply(this.gfxHost, [this].concat(a)) || 0;
    var f = BUILTINS[name];
    if (!f) {
      if (!this.warned) this.warned = {};
      if (!this.warned[name] && typeof console !== 'undefined') { this.warned[name] = true; console.warn('JSFX: no ' + name + '()'); }
      return 0;
    }
    return f.apply(this, a);
  };

  // @serialize: values written in order, read back in order.
  JSFX.prototype.fileVar = function (h, cur) {
    h = Math.trunc(h);
    if (h === 0 && this.serial) {
      if (this.serial.mode === 'write') { this.serial.data.push(cur); return cur; }
      var d = this.serial.data[this.serial.pos++];
      return d === undefined ? cur : (typeof d === 'number' ? d : cur);
    }
    var f = this.files && this.files[h];
    if (f && f.pos < f.values.length) return f.values[f.pos++];
    return cur;
  };
  JSFX.prototype.serialize = function () {
    this.serial = { mode: 'write', data: [], pos: 0 };
    this.runSection('serialize');
    var data = this.serial.data;
    this.serial = null;
    return { sliders: this.file.sliders.map(function (sl) { return this.v[this.slots[sl.variable]]; }, this), data: data };
  };
  JSFX.prototype.deserialize = function (state) {
    if (!state) return;
    if (!this.initialised) this.init();
    if (state.sliders) this.file.sliders.forEach(function (sl, i) {
      if (state.sliders[i] !== undefined) this.v[this.slots[sl.variable]] = state.sliders[i];
    }, this);
    this.serial = { mode: 'read', data: state.data || [], pos: 0 };
    this.runSection('serialize');
    this.serial = null;
    this.sliderDirty = true;
  };

  // Run a line of EEL2 against this instance: how a device's own buttons
  // (Panic, Transfer to Pads...) are pressed from Middaw's controls.
  JSFX.prototype.eval = function (code) {
    var C = new Compiler(this.slots);
    C.gfx = !!opts.gfx;
    C.strConsts = this.strConsts;
    // reuse the instance's functions by recompiling them into this snippet
    var funcs = {};
    var self = this;
    ['init', 'slider', 'block', 'sample', 'serialize', 'gfx'].forEach(function (name) {
      self.file.sections[name].forEach(function (part) { try { parse(lex(part.code, part.line), funcs); } catch (e) {} });
    });
    C.funcs = funcs;
    var body = C.compileSection(code, 1);
    var fn = this.evalIn('(function () {' + C.funcCode.join('\n') + ' return function () {' + body + '}; })()');
    if (this.slots.__count > this.v.length) throw new EelError('too many new variables in eval');
    return fn();
  };

  var BUILTINS = {
    memset: function (d, val, n) { for (var i = 0; i < n; i++) this.wr(d + i, val); return d; },
    memcpy: function (d, s, n) {
      var tmp = [];
      for (var i = 0; i < n; i++) tmp.push(this.rd(s + i));
      for (var j = 0; j < n; j++) this.wr(d + j, tmp[j]);
      return d;
    },
    freembuf: function (n) { return n; },
    mem_set_values: function () { return 0; },
    time: function () { return Math.floor(Date.now() / 1000); },
    time_precise: function () { return (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000; },
    sliderchange: function () { if (this.onSliderChange) this.onSliderChange(); return 0; },
    slider_automate: function () { if (this.onSliderChange) this.onSliderChange(); return 0; },
    slider_show: function () { return 0; },
    strlen: function (s) { return this.str(s).length; },
    strcpy: function (d, s) { return this.setStr(d, this.str(s)); },
    strcat: function (d, s) { return this.setStr(d, this.str(d) + this.str(s)); },
    strcmp: function (a, b) { var x = this.str(a), y = this.str(b); return x < y ? -1 : x > y ? 1 : 0; },
    stricmp: function (a, b) { var x = this.str(a).toLowerCase(), y = this.str(b).toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; },
    strncpy: function (d, s, n) { return this.setStr(d, this.str(s).slice(0, n)); },
    strcpy_substr: function (d, s, off, len) {
      var str = this.str(s);
      if (off < 0) off = Math.max(0, str.length + off);
      return this.setStr(d, len === undefined ? str.slice(off) : str.substr(off, Math.max(0, len)));
    },
    str_getchar: function (s, i) { var str = this.str(s); if (i < 0) i += str.length; return i >= 0 && i < str.length ? str.charCodeAt(i) : 0; },
    str_setchar: function (s, i, c) {
      var str = this.str(s); if (i < 0) i += str.length;
      if (i >= 0 && i <= str.length) this.setStr(s, str.slice(0, i) + String.fromCharCode(c) + str.slice(i + 1));
      return c;
    },
    sprintf: function (d, fmt) {
      var self = this, vals = Array.prototype.slice.call(arguments, 2);
      var f = this.str(fmt);
      // %s takes a string handle
      var vi = 0;
      var mapped = [];
      f.replace(/%[-+ 0#]*\d*(?:\.\d+)?([dixXfgecs%])/g, function (all, conv) {
        if (conv === '%') return all;
        var x = vals[vi++];
        mapped.push(conv === 's' ? { str: self.str(x) } : x);
        return all;
      });
      return this.setStr(d, eelFormat(f, mapped));
    },
    file_open: function (s) {
      var name = this.str(s);
      var vals = this.openFile ? this.openFile(name) : null;
      if (!vals) return -1;
      if (!this.files) { this.files = {}; this.nextFile = 1; }
      var h = this.nextFile++;
      this.files[h] = { values: vals.samples || vals, pos: 0, channels: vals.channels || 1, rate: vals.rate || this.srate };
      return h;
    },
    file_close: function (h) { if (this.files) delete this.files[h]; return 0; },
    file_rewind: function (h) { if (this.files && this.files[h]) this.files[h].pos = 0; return 0; },
    file_avail: function (h) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) return this.serial.mode === 'write' ? -1 : this.serial.data.length - this.serial.pos;
      var f = this.files && this.files[h];
      return f ? f.values.length - f.pos : 0;
    },
    file_riff: function () { return 0; },
    file_text: function () { return 0; },
    file_mem: function (h, addr, n) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) {
        if (this.serial.mode === 'write') { for (var i = 0; i < n; i++) this.serial.data.push(this.rd(addr + i)); }
        else { for (var j = 0; j < n; j++) { var d = this.serial.data[this.serial.pos++]; this.wr(addr + j, typeof d === 'number' ? d : 0); } }
        return n;
      }
      var f = this.files && this.files[h];
      if (!f) return 0;
      var k = 0;
      for (; k < n && f.pos < f.values.length; k++) this.wr(addr + k, f.values[f.pos++]);
      return k;
    },
    file_string: function (h, s) {
      h = Math.trunc(h);
      if (h === 0 && this.serial) {
        if (this.serial.mode === 'write') this.serial.data.push({ s: this.str(s) });
        else { var d = this.serial.data[this.serial.pos++]; if (d && d.s !== undefined) this.setStr(s, d.s); }
      }
      return 1;
    },
    export_buffer_to_project: function () { return this.exportBuffer ? this.exportBuffer.apply(this, arguments) : 0; },
    get_host_placement: function () { return 0; },
    get_host_numchan: function () { return 2; },
    set_host_numchan: function () { return 0; },
    get_pin_mapping: function () { return 0; },
    set_pdc: function () { return 0; },
    printf: function () { return 0; },
    gfx_getchar: function () { return 0; }
  };

  NS.JSFX = JSFX;
  NS.parseFile = parseFile;
  NS.parseSliderLine = parseSliderLine;
  NS.lexEel = lex;
  NS.parseEel = parse;
  NS.EelError = EelError;
})(typeof module === 'object' && module.exports
  ? (module.exports = (globalThis.MiddawJSFX = globalThis.MiddawJSFX || {}))
  : (globalThis.MiddawJSFX = globalThis.MiddawJSFX || {}));


/* ---- kit/gfx.js ---- */
/* REAPER's gfx_* drawing, on Max's mgraphics: the host a JSFX's @gfx runs on
 * (MiddawJSFX's runGfx). Each method takes the JSFX first, reads gfx_r, gfx_x
 * and the rest from its variables, and draws as REAPER would: text from its
 * top-left, gfx_x moved on past it, angles from twelve o'clock clockwise.
 *
 * gfx_showmenu cannot wait for a choice inside a frame, so it asks for one:
 * `menu` is set, the frame returns 0, and the device draws the menu. When an
 * item is chosen the device puts the variables back as they were at the start
 * of that frame and runs it again, and this time gfx_showmenu returns the item.
 */
var Gfx = (function () {
  'use strict';
  function Host(g) {
    this.g = g;
    this.fonts = { 0: { name: 'Arial', size: 13, flags: 0 } };
    this.font = 0;
    this.menu = null;        // { text, x, y } asked for this frame
    this.choice = 0;         // the item to give gfx_showmenu on the replayed frame
    this.slots = null;
  }
  Host.prototype.begin = function (g, fx) {
    this.g = g;
    if (!this.slots || this.fx !== fx) {
      this.fx = fx;
      var s = fx.slots;
      this.slots = { r: s.gfx_r, g: s.gfx_g, b: s.gfx_b, a: s.gfx_a, x: s.gfx_x, y: s.gfx_y, texth: s.gfx_texth,
                     mx: s.mouse_x, my: s.mouse_y, clear: s.gfx_clear };
    }
    this.menu = null;
    this.applyFont();
  };
  Host.prototype.v = function (k) { return this.fx.v[this.slots[k]]; };
  Host.prototype.set = function (k, x) { this.fx.v[this.slots[k]] = x; };
  // Every colour the script sets goes through Palette.tone: the house scheme
  // becomes Live's, other greys lose their tint, other colours stay.
  function toned(r, g, b) { return typeof Palette !== 'undefined' ? Palette.tone(r, g, b) : [clamp(r), clamp(g), clamp(b)]; }
  Host.prototype.colour = function () {
    var c = toned(this.v('r') || 0, this.v('g') || 0, this.v('b') || 0);
    this.g.set_source_rgba(c[0], c[1], c[2], clamp(this.v('a')));
  };
  // EEL2 strings are bytes; REAPER draws them as UTF-8.
  function utf8(s) { try { return decodeURIComponent(escape(s)); } catch (e) { return s; } }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : (x || 0); }
  function num(x, d) { return x === undefined || x !== x ? d : x; }

  // ------------------------------------------------------------ colour ---
  Host.prototype.gfx_set = function (fx, r, g, b, a) {
    r = num(r, 0);
    this.set('r', r); this.set('g', num(g, r)); this.set('b', num(b, r)); this.set('a', num(a, 1));
    return 0;
  };

  // ------------------------------------------------------------ shapes ---
  Host.prototype.gfx_rect = function (fx, x, y, w, h, filled) {
    if (!(w > 0 && h > 0)) return 0;
    this.colour();
    if (num(filled, 1)) { this.g.rectangle(x, y, w, h); this.g.fill(); }
    else { this.g.set_line_width(1); this.g.rectangle(x + 0.5, y + 0.5, w - 1, h - 1); this.g.stroke(); }
    return 0;
  };
  Host.prototype.gfx_line = function (fx, x1, y1, x2, y2) {
    this.colour();
    this.g.set_line_width(1);
    this.g.move_to(x1 + 0.5, y1 + 0.5); this.g.line_to(x2 + 0.5, y2 + 0.5); this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_lineto = function (fx, x, y) {
    this.gfx_line(fx, this.v('x'), this.v('y'), x, y);
    this.set('x', x); this.set('y', y);
    return 0;
  };
  Host.prototype.gfx_circle = function (fx, x, y, r, fill) {
    this.colour();
    this.g.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    if (num(fill, 0)) this.g.fill(); else { this.g.set_line_width(1); this.g.stroke(); }
    return 0;
  };
  Host.prototype.gfx_arc = function (fx, x, y, r, a1, a2) {
    this.colour();
    this.g.set_line_width(1);
    this.g.arc(x, y, Math.max(0, r), a1 - Math.PI / 2, a2 - Math.PI / 2);
    this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_roundrect = function (fx, x, y, w, h, radius) {
    this.colour();
    this.g.set_line_width(1);
    this.g.rectangle_rounded(x + 0.5, y + 0.5, w, h, radius * 2, radius * 2);
    this.g.stroke();
    return 0;
  };
  Host.prototype.gfx_triangle = function (fx) {
    var p = Array.prototype.slice.call(arguments, 1);
    if (p.length < 6) return 0;
    this.colour();
    this.g.move_to(p[0], p[1]);
    for (var i = 2; i + 1 < p.length; i += 2) this.g.line_to(p[i], p[i + 1]);
    this.g.close_path();
    this.g.fill();
    return 0;
  };
  Host.prototype.gfx_gradrect = function (fx, x, y, w, h, r, g, b, a) {
    var c = toned(r || 0, g || 0, b || 0);
    this.g.set_source_rgba(c[0], c[1], c[2], clamp(num(a, 1)));
    this.g.rectangle(x, y, w, h); this.g.fill();
    return 0;
  };

  // -------------------------------------------------------------- text ---
  // gfx_setfont(idx, name, size, flags): flags is a character code, 'b' bold, 'i' italic.
  Host.prototype.gfx_setfont = function (fx, idx, name, size, flags) {
    idx = Math.trunc(num(idx, 0));
    if (name !== undefined && idx > 0) {
      this.fonts[idx] = { name: fx.str(name) || 'Arial', size: num(size, 13), flags: Math.trunc(num(flags, 0)) };
    }
    this.font = this.fonts[idx] ? idx : 0;
    this.applyFont();
    return 1;
  };
  Host.prototype.gfx_getfont = function () { return this.font; };
  Host.prototype.applyFont = function () {
    var f = this.fonts[this.font] || this.fonts[0], fl = f.flags;
    // REAPER's names for the system face are not names Max can ask for
    var face = /^\./.test(f.name) || /^segoe/i.test(f.name) ? 'Arial' : f.name;
    var bold = fl === 98 || ((fl >> 8) & 255) === 98 || ((fl >> 16) & 255) === 98;
    var italic = fl === 105 || ((fl >> 8) & 255) === 105 || ((fl >> 16) & 255) === 105;
    this.g.select_font_face(face, italic ? 'italic' : 'normal', bold ? 'bold' : 'normal');
    this.g.set_font_size(f.size);
    this.size = f.size;
    if (this.slots) this.set('texth', Math.round(f.size));
  };
  Host.prototype.measure = function (s) {
    var m = this.g.text_measure(s);
    return [m[0], Math.max(m[1], this.size)];
  };
  Host.prototype.gfx_measurestr = function (fx, s) { this.fx.gm = this.measure(utf8(fx.str(s))); return this.fx.gm[0]; };
  Host.prototype.gfx_measurechar = function (fx, c) { this.fx.gm = this.measure(String.fromCharCode(c)); return this.fx.gm[0]; };
  Host.prototype.text = function (s, flags, right, bottom) {
    var x = this.v('x'), y = this.v('y'), m = this.measure(s);
    flags = Math.trunc(num(flags, 0));
    if (right !== undefined && !(flags & 256)) {
      if (flags & 1) x = x + (right - x - m[0]) / 2; else if (flags & 2) x = right - m[0];
      if (flags & 4) y = y + (bottom - y - m[1]) / 2; else if (flags & 8) y = bottom - m[1];
    }
    this.colour();
    this.g.move_to(x, y + this.size * 0.8);
    this.g.show_text(s);
    this.set('x', x + m[0]);
    return 0;
  };
  Host.prototype.gfx_drawstr = function (fx, s, flags, right, bottom) { return this.text(utf8(fx.str(s)), flags, right, bottom); };
  Host.prototype.gfx_drawchar = function (fx, c) { return this.text(String.fromCharCode(c)); };
  Host.prototype.gfx_drawnumber = function (fx, n, digits) { return this.text(Number(n).toFixed(Math.max(0, Math.trunc(num(digits, 0))))); };
  Host.prototype.gfx_printf = function (fx, fmt) {
    var args = Array.prototype.slice.call(arguments, 2);
    var s = fx.str(fmt).replace(/%(-?\d*)(?:\.(\d+))?([dfsxXc%])/g, function (m, w, p, k) {
      if (k === '%') return '%';
      var a = args.shift();
      if (k === 's') return fx.str(a);
      if (k === 'c') return String.fromCharCode(a);
      if (k === 'x' || k === 'X') { var h = Math.trunc(a).toString(16); return k === 'X' ? h.toUpperCase() : h; }
      return k === 'd' ? String(Math.trunc(a)) : Number(a).toFixed(p === undefined ? 6 : +p);
    });
    return this.text(utf8(s));
  };

  // ------------------------------------------------------------- input ---
  // gfx_getchar(65536) asks about the window: 1 it has focus, 2 it is shown,
  // 4 the mouse is in it. With no argument it is the next key typed, which the
  // window's [key] hands in (Host.key); with a key it asks whether it is held.
  Host.prototype.gfx_getchar = function (fx, c) {
    if (c === 65536) return 1 | 2 | (this.mouseIn ? 4 : 0);
    if (c) return 0;
    return this.keys && this.keys.length ? this.keys.shift() : 0;
  };
  // Max's key codes as REAPER's gfx_getchar gives them: the arrows and the
  // editing keys are four-letter codes there.
  var KEYS = { 28: 0x6C656674, 29: 0x72676874, 30: 0x7570, 31: 0x646F776E, 127: 0x64656C, 8: 8, 9: 9, 13: 13, 27: 27,
               '-9': 0x6C656674, '-10': 0x72676874, '-11': 0x7570, '-12': 0x646F776E };
  Host.prototype.key = function (code) {
    (this.keys = this.keys || []).push(KEYS[code] !== undefined ? KEYS[code] : code);
    if (this.keys.length > 32) this.keys.shift();
  };
  Host.prototype.gfx_showmenu = function (fx, s) {
    if (this.choice) { var k = this.choice; this.choice = 0; return k; }
    this.menu = { text: utf8(fx.str(s)), x: this.v('x'), y: this.v('y') };
    return 0;
  };
  Host.prototype.gfx_setcursor = function () { return 0; };
  Host.prototype.gfx_getdropfile = function () { return 0; };
  Host.prototype.gfx_update = function () { return 0; };

  // A menu as gfx_showmenu writes it: items split by |, '#' greyed, '!'
  // ticked, '>' opens a submenu, '<' closes one. Numbered as REAPER numbers
  // them: every item that is not a submenu's title, in order, from 1.
  function parseMenu(text) {
    var out = [], depth = 0, n = 0;
    String(text).split('|').forEach(function (raw) {
      var t = raw, grey = false, tick = false, opens = false, closes = false;
      for (;;) {
        var c = t.charAt(0);
        if (c === '#') { grey = true; t = t.slice(1); } else if (c === '!') { tick = true; t = t.slice(1); }
        else if (c === '>') { opens = true; t = t.slice(1); } else if (c === '<') { closes = true; t = t.slice(1); } else break;
      }
      if (opens) { out.push({ label: t, title: true, depth: depth }); depth++; return; }
      if (t === '' && !closes) { out.push({ rule: true, depth: depth }); return; }
      n++;
      out.push({ label: t, index: n, grey: grey, tick: tick, depth: depth });
      if (closes) depth = Math.max(0, depth - 1);
    });
    return out;
  }

  // gfx_clear's colour (r + g * 256 + b * 65536) as Live draws it.
  function clearColour(c) { return toned((c & 255) / 255, ((c >> 8) & 255) / 255, ((c >> 16) & 255) / 255); }

  // The menu gfx_showmenu asked for, drawn the same in every device.
  var ITEM_H = 20;
  function drawMenu(g, r, items, hover) {
    var P = Palette.C, rgb = Palette.rgb, c;
    c = rgb(P.popup); g.set_source_rgba(c[0], c[1], c[2], 1); g.rectangle(r[0], r[1], r[2], r[3]); g.fill();
    c = rgb(P.edge); g.set_source_rgba(c[0], c[1], c[2], 1); g.set_line_width(1); g.rectangle(r[0] + 0.5, r[1] + 0.5, r[2] - 1, r[3] - 1); g.stroke();
    items.forEach(function (it, i) {
      var y = r[1] + 4 + i * ITEM_H;
      if (it.rule) { c = rgb(P.rule); g.set_source_rgba(c[0], c[1], c[2], 1); g.rectangle(r[0] + 6, y + ITEM_H / 2, r[2] - 12, 1); g.fill(); return; }
      var on = i === hover && it.index && !it.grey;
      if (on) { c = rgb(P.accent); g.set_source_rgba(c[0], c[1], c[2], 1); g.rectangle(r[0] + 2, y, r[2] - 4, ITEM_H); g.fill(); }
      c = rgb(on ? P.ink : it.grey || it.title ? P.dim : P.text);
      g.set_source_rgba(c[0], c[1], c[2], 1);
      g.move_to(r[0] + 22 + it.depth * 12, y + 14);
      g.show_text(it.label);
      if (it.tick) { g.move_to(r[0] + 7 + it.depth * 12, y + 14); g.show_text('✓'); }
    });
  }

  return { Host: Host, parseMenu: parseMenu, clearColour: clearColour, drawMenu: drawMenu, ITEM_H: ITEM_H };
})();


/* ---- kit/live.js ---- */
/* The Live set, as the family's devices need it: the song's tempo, meter and
 * scale, the notes of the clip being edited, somewhere to put new notes, and
 * a way to hear notes before they are used.
 *
 * Everything goes through the Live Object Model (LiveAPI). Times are beats,
 * which in Live are quarter notes - the unit every family engine already
 * speaks - so nothing is converted but the field names.
 */
var Live = (function () {
  'use strict';
  function api(path) { return new LiveAPI(null, path); }
  function one(a, prop) { var v = a.get(prop); return Array.isArray(v) ? v[0] : v; }
  function exists(a) { return a && Number(a.id) !== 0; }
  function json(v) {
    if (typeof v === 'string') return JSON.parse(v);
    if (Array.isArray(v) && typeof v[0] === 'string' && v.length === 1) return JSON.parse(v[0]);
    return v;
  }

  // Live 12's scale names, as ScaleView numbers its scales (1-16). A scale
  // ScaleView has no name for is left out: the device keeps its own key.
  var SCALE = {
    'Major': 1, 'Minor': 2, 'Harmonic Minor': 3, 'Dorian': 5, 'Phrygian': 6, 'Lydian': 7,
    'Mixolydian': 8, 'Major Pentatonic': 10, 'Minor Pentatonic': 11, 'Minor Blues': 13,
    'Whole Tone': 14, 'Whole-half Dim.': 15, 'Half-whole Dim.': 16
  };
  // ScaleView's eighteen roots, and the spelling a key on each pitch class
  // takes: flats for the major side, sharps where a minor key has them.
  var ROOTS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb'];
  var MAJOR_SIDE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  var MINOR_SIDE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var MINORISH = { 2: 1, 3: 1, 5: 1, 6: 1, 11: 1, 13: 1 };
  var SCALE_NAMES = ['Major', 'Minor (Natural)', 'Harmonic Minor', 'Ionian', 'Dorian', 'Phrygian', 'Lydian',
                     'Mixolydian', 'Aeolian', 'Major Pentatonic', 'Minor Pentatonic', 'Major Blues', 'Minor Blues',
                     'Whole Tone', 'Diminished Whole-Half', 'Diminished Half-Whole'];

  // Live's scale (a root pitch class and a name) as the family's key, or
  // null for a scale ScaleView does not have.
  function keyOf(pc, name) {
    var sc = SCALE[String(name)];
    if (!sc) return null;
    return { root: ROOTS.indexOf((MINORISH[sc] ? MINOR_SIDE : MAJOR_SIDE)[((+pc % 12) + 12) % 12]) + 1, scale: sc };
  }

  function song() {
    var s = api('live_set');
    var out = { tempo: +one(s, 'tempo') || 120, num: +one(s, 'signature_numerator') || 4,
                den: +one(s, 'signature_denominator') || 4, playing: !!+one(s, 'is_playing'),
                position: +one(s, 'current_song_time') || 0, key: null };
    var mode = s.get('scale_mode');
    if (mode !== undefined && mode !== null) {
      var name = String(one(s, 'scale_name')), pc = +one(s, 'root_note');
      out.liveScale = { on: !!+(Array.isArray(mode) ? mode[0] : mode), name: name, root: pc };
      out.key = keyOf(pc, name);
    }
    return out;
  }

  function detailClip() {
    var c = api('live_set view detail_clip');
    if (!exists(c) || !+one(c, 'is_midi_clip')) return null;
    return c;
  }

  // The clip being edited: its selected notes if any are selected, else every
  // note in its loop. Starts are from the start of what was taken.
  function clipNotes() {
    var c = detailClip();
    if (!c) return null;
    var from = +one(c, 'loop_start') || 0, to = +one(c, 'loop_end') || 0;
    var raw = null, selected = false;
    try { raw = json(c.call('get_selected_notes_extended')); selected = raw && raw.notes && raw.notes.length > 0; } catch (e) { raw = null; }
    if (!selected) raw = json(c.call('get_notes_extended', 0, 128, from, Math.max(0, to - from)));
    var notes = ((raw && raw.notes) || []).filter(function (n) { return !n.mute; }).map(function (n) {
      return { start: n.start_time, len: n.duration, pitch: n.pitch, vel: Math.round(n.velocity) };
    });
    var first = selected && notes.length ? Math.min.apply(null, notes.map(function (n) { return n.start; })) : from;
    var beats = to - from;
    if (selected) {
      var bar = 4, end = 0;
      notes.forEach(function (n) { end = Math.max(end, n.start + n.len); });
      first = Math.floor(first / bar) * bar;
      beats = Math.ceil((end - first) / bar) * bar;
    }
    notes.forEach(function (n) { n.start -= first; });
    notes.sort(function (a, b) { return a.start - b.start || a.pitch - b.pitch; });
    return { notes: notes, beats: beats, name: String(one(c, 'name') || ''), selected: selected, drums: drumTrack() };
  }

  // A track whose instrument is a Drum Rack plays drums: its note numbers name
  // drums, not pitches, and the engines treat them that way.
  function drumTrack() {
    try {
      var track = api('this_device canonical_parent'), n = track.getcount('devices');
      for (var i = 0; i < n; i++) if (+one(api(track.unquotedpath + ' devices ' + i), 'can_have_drum_pads')) return true;
    } catch (e) { /* not known: not drums */ }
    return false;
  }

  function liveNotes(notes) {
    return { notes: notes.map(function (n) {
      return { pitch: Math.max(0, Math.min(127, Math.round(n.pitch))), start_time: Math.max(0, n.start),
               duration: Math.max(1 / 128, n.len), velocity: Math.max(1, Math.min(127, Math.round(n.vel || 100))), mute: 0 };
    }) };
  }

  function undoable(fn) {
    var s = api('live_set');
    try { s.call('begin_undo_step'); } catch (e) { /* Live before 11.1 */ }
    try { return fn(); } finally { try { s.call('end_undo_step'); } catch (e2) { /* as above */ } }
  }

  function show(clip) {
    try { api('live_set view').set('detail_clip', 'id', Number(clip.id)); } catch (e) { /* the clip is made either way */ }
  }

  function selectedScene() {
    var scene = api('live_set view selected_scene'), n = api('live_set').getcount('scenes');
    for (var i = 0; i < n; i++) if (Number(api('live_set scenes ' + i).id) === Number(scene.id)) return i;
    return 0;
  }
  function thisTrack() {
    var track = api('this_device canonical_parent');
    if (!exists(track) || !+one(track, 'has_midi_input')) return null;
    return track;
  }
  // Where this device's track is in the set, for putting new tracks beside it.
  function trackIndex(track) {
    var n = api('live_set').getcount('tracks');
    for (var i = 0; i < n; i++) if (Number(api('live_set tracks ' + i).id) === Number(track.id)) return i;
    return n - 1;
  }
  function clipInSlot(slot, notes, beats, name) {
    slot.call('create_clip', Math.max(1, beats));
    var clip = api(slot.unquotedpath + ' clip');
    if (name) clip.set('name', name);
    clip.call('add_new_notes', liveNotes(notes));
    return clip;
  }
  function freeSlot(track, from) {
    var n = track.getcount('clip_slots');
    for (var k = 0; k < n; k++) {
      var at = (from + k) % n, slot = api(track.unquotedpath + ' clip_slots ' + at);
      if (!+one(slot, 'has_clip')) return { slot: slot, at: at };
    }
    return null;
  }
  function arrangementClipOn(track, notes, beats, name, at) {
    var before = track.getcount('arrangement_clips');
    try { track.call('create_midi_clip', at, Math.max(1, beats)); } catch (e) { /* checked below */ }
    var count = track.getcount('arrangement_clips');
    if (!(count > before)) return false;
    for (var i = 0; i < count; i++) {
      var clip = api(track.unquotedpath + ' arrangement_clips ' + i);
      if (Math.abs((+one(clip, 'start_time') || 0) - at) < 1e-6) {
        if (name) clip.set('name', name);
        clip.call('add_new_notes', liveNotes(notes));
        return true;
      }
    }
    return false;
  }

  // New notes, as a new clip in the first free slot on this device's track,
  // from the selected scene down. `more` are further parts ({name, notes}),
  // each on a new MIDI track after this one, in the same scene. Returns what
  // happened, for the status line.
  function newClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var free = freeSlot(track, selectedScene());
    if (!free) return { ok: false, message: 'Every clip slot on this track is full. Add a scene, then try again.' };
    return undoable(function () {
      var clip = clipInSlot(free.slot, notes, beats, name);
      var made = newTracks(track, more, function (t) {
        clipInSlot(api(t.unquotedpath + ' clip_slots ' + free.at), this.notes, beats, this.name);
      });
      show(clip);
      return { ok: true, message: 'Added a clip in scene ' + (free.at + 1) + (made ? ', and ' + made + ' on new tracks beside it.' : '.') };
    });
  }

  // New notes on a new MIDI track beside this one, in the selected scene:
  // a suggestion goes with the music it was made for, not over it.
  function newTrackClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var scene = selectedScene();
    return undoable(function () {
      var parts = [{ name: name, notes: notes }].concat(more || []);
      newTracks(track, parts, function (t) { show(clipInSlot(api(t.unquotedpath + ' clip_slots ' + scene), this.notes, beats, this.name)); });
      return { ok: true, message: parts.length === 1 ? 'Added a track beside this one, with the clip in scene ' + (scene + 1) + '.'
                                                     : 'Added ' + parts.length + ' tracks beside this one, with the clips in scene ' + (scene + 1) + '.' };
    });
  }

  // Each further part on a new MIDI track, in order, after this one.
  function newTracks(track, more, put) {
    if (!more || !more.length) return '';
    var at = trackIndex(track), song = api('live_set');
    more.forEach(function (part, k) {
      song.call('create_midi_track', at + 1 + k);
      var t = api('live_set tracks ' + (at + 1 + k));
      t.set('name', part.name);
      put.call(part, t);
    });
    return more.length === 1 ? 'one more part' : more.length + ' more parts';
  }

  // New notes in place of the notes of the clip being edited, from its loop start.
  function replaceInClip(notes, beats) {
    var c = detailClip();
    if (!c) return { ok: false, message: 'No MIDI clip is open. Open one in Detail View, then try again.' };
    var from = +one(c, 'loop_start') || 0;
    return undoable(function () {
      var span = Math.max(beats, (+one(c, 'loop_end') || 0) - from);
      c.call('remove_notes_extended', 0, 128, from, span);
      c.call('add_new_notes', liveNotes(notes.map(function (n) {
        return { start: n.start + from, len: n.len, pitch: n.pitch, vel: n.vel };
      })));
      if ((+one(c, 'loop_end') || 0) < from + beats) c.set('loop_end', from + beats);
      return { ok: true, message: 'Replaced the notes in “' + (String(one(c, 'name') || '') || 'the clip') + '”.' };
    });
  }

  // New notes in the Arrangement at the insert marker, on this device's track
  // (Track.create_midi_clip, Live 12.2 and later); further parts as above.
  function arrangementClip(notes, beats, name, more) {
    var track = thisTrack();
    if (!track) return { ok: false, message: 'This device needs to be on a MIDI track.' };
    var at = +one(api('live_set'), 'current_song_time') || 0;
    return undoable(function () {
      if (!arrangementClipOn(track, notes, beats, name, at)) {
        return { ok: false, message: 'This version of Live can\u2019t add Arrangement clips from a device. Choose New Clip instead.' };
      }
      var made = newTracks(track, more, function (t) { arrangementClipOn(t, this.notes, beats, this.name, at); });
      return { ok: true, message: 'Added a clip to the Arrangement at beat ' + (Math.round(at * 100) / 100 + 1) +
               (made ? ', and ' + made + ' on new tracks beside it.' : '.') };
    });
  }

  // ------------------------------------------------------------ player ---
  // Notes heard through this device's MIDI out: the instrument after it on
  // the track plays them. A Task ticks every few milliseconds and sends what
  // is due; nothing waits on the transport.
  function Player(send) {
    this.send = send; this.events = []; this.pos = 0; this.t0 = 0; this.task = null; this.sounding = {};
    this.onEnd = null;
  }
  Player.prototype.play = function (notes, tempo, onEnd) {
    this.stop();
    var ms = 60000 / (tempo || 120), ev = [];
    notes.forEach(function (n) {
      ev.push({ t: n.start * ms, on: true, pitch: n.pitch, vel: n.vel || 100 });
      ev.push({ t: (n.start + n.len) * ms - 1, on: false, pitch: n.pitch });
    });
    ev.sort(function (a, b) { return a.t - b.t || (a.on === b.on ? 0 : a.on ? 1 : -1); });
    this.events = ev; this.pos = 0; this.t0 = Date.now(); this.onEnd = onEnd || null;
    var self = this;
    this.task = new Task(function () { self.tick(); }, this);
    this.task.interval = 4;
    this.task.repeat();
    this.tick();
  };
  Player.prototype.tick = function () {
    var now = Date.now() - this.t0;
    while (this.pos < this.events.length && this.events[this.pos].t <= now) {
      var e = this.events[this.pos++];
      if (e.on) { this.sounding[e.pitch] = (this.sounding[e.pitch] || 0) + 1; this.send([0x90, e.pitch, Math.max(1, Math.min(127, Math.round(e.vel)))]); }
      else if (this.sounding[e.pitch]) { this.sounding[e.pitch]--; this.send([0x80, e.pitch, 0]); }
    }
    if (this.pos >= this.events.length) {
      var end = this.onEnd;
      this.stop();
      if (end) end();
    }
  };
  Player.prototype.playing = function () { return !!this.task; };
  Player.prototype.stop = function () {
    if (this.task) { this.task.cancel(); this.task.freepeer && this.task.freepeer(); this.task = null; }
    var self = this;
    Object.keys(this.sounding).forEach(function (p) {
      for (var i = 0; i < self.sounding[p]; i++) self.send([0x80, +p, 0]);
    });
    this.sounding = {};
    this.onEnd = null;
  };

  return { song: song, clipNotes: clipNotes, newClip: newClip, newTrackClip: newTrackClip, replaceInClip: replaceInClip,
           arrangementClip: arrangementClip, drumTrack: drumTrack, Player: Player, ROOTS: ROOTS, SCALE_NAMES: SCALE_NAMES,
           keyOf: keyOf };
})();


/* ---- kit/jsfx_device.js ---- */
/* A family JSFX as a Max for Live MIDI effect: the .jsfx itself, unchanged,
 * on Middaw's EEL2 runtime, with its own @gfx window drawn in this [v8ui].
 *
 * The [v8ui] sits in the device's window subpatcher, which the device strip's
 * Show Window button opens. Its code runs whether the window is open or not.
 *
 * A Task ticks every few milliseconds: the MIDI that arrived since the last
 * tick goes in, a block as long as the time that passed is run, and what the
 * plug-in sends comes straight out. Live's tempo, meter, transport and song
 * position are what REAPER would give it.
 *
 * Expects, before it: Gfx, Live, MiddawJSFX, and DEVICE = { main, files,
 * actions? }. A device's own buttons (Load Clip, Insert the Take) are in
 * ACTIONS, defined in the repository's ableton/actions.js, which shares this
 * file's global scope: its own functions must not reuse a name defined here
 * (send, say, load, tick...), or this file's takes its place.
 * Inlet 0: bang (Live is ready), MIDI bytes, restore, and the strip's
 * commands. Outlets: 0 MIDI bytes, 1 the saved state to [pattr], 2 the
 * strip's status line.
 *
 * DEVICE.audio: the sound is gen~'s (ableton/kit/jsfx2gen.js), not this
 * file's. The plug-in here runs @init, @slider and @gfx only, for its window;
 * what its sliders say goes to gen~ (outlet 3, "sliderN value"), with Live's
 * tempo and transport, and MIDI goes to gen~ through the buffer~ the patcher
 * names in "mqname" (three values a message, the count at 0).
 */
inlets = 1;
outlets = DEVICE.audio ? (DEVICE.drops ? 5 : 4) : 3;
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var SR = 48000;
var ACTIONS = typeof ACTIONS === 'undefined' ? {} : ACTIONS;

// The bundle keeps files as bytes; the runtime reads a .jsfx as text.
function source(name) {
  var t = DEVICE.files[name];
  if (t === undefined) return null;
  try { return decodeURIComponent(escape(t)); } catch (e) { return t; }
}
var fx = new MiddawJSFX.JSFX(source(DEVICE.main), { gfx: true, sampleRate: SR, readImport: source });
fx.init(SR);

var D = {
  ready: false, pending: null, task: null, last: 0, beat: 0, pos: 0,
  midiIn: [], running: [], status: '', host: new Gfx.Host(mgraphics),
  mouse: { x: -1, y: -1, cap: 0, wheel: 0 }, release: false, frameSaw: true,
  menu: null, menuSnap: null, menuMouse: null, frames: 0, song: { tempo: 120, num: 4, den: 4, playing: false }
};

function say(msg) { D.status = msg || ''; outlet(2, 'set', D.status); }
function send(data) { for (var i = 0; i < data.length; i++) outlet(0, data[i]); }

// ---------------------------------------------------------------- MIDI --
// [midiin] gives a byte at a time; a message is whole once its data are in.
function msg_int(b) {
  b = b & 255;
  if (b >= 0xF8) return;                      // real-time: not passed to the plug-in
  if (b & 0x80) { D.running = [b]; return; }
  if (!D.running.length) return;
  D.running.push(b);
  var st = D.running[0] & 0xF0, need = (st === 0xC0 || st === 0xD0) ? 2 : 3;
  if (D.running[0] >= 0xF0) { D.running = []; return; }  // system messages are not passed on
  if (D.running.length === need) {
    D.midiIn.push(need === 2 ? [D.running[0], D.running[1], 0] : D.running.slice());
    D.running = [D.running[0]];
  }
}

// --------------------------------------------------------------- clock --
function readSong() {
  try {
    var s = Live.song();
    D.song = { tempo: s.tempo, num: s.num, den: s.den, playing: s.playing, position: s.position };
  } catch (e) { /* outside Live */ }
}
// ------------------------------------------------------------ gen~ ----
var GEN = { sent: {}, mq: null, written: 0, CAP: 256, every: 0 };
function mqname(name) {
  try { GEN.mq = new Buffer(String(name)); } catch (e) { GEN.mq = null; }
}
function toGen() {
  fx.file.sliders.forEach(function (sl) {
    var v = fx.sliderByIndex(sl.index);
    if (GEN.sent[sl.index] !== v) { GEN.sent[sl.index] = v; outlet(3, 'slider' + sl.index, v); }
  });
  (DEVICE.fromWindow || []).forEach(function (n) {
    var v = fx.getVar(n);
    if (GEN.sent['w_' + n] !== v) { GEN.sent['w_' + n] = v; outlet(3, 'w_' + n, v); }
  });
  if ((GEN.every++ % 12) === 0) {
    outlet(3, 'tempo', D.song.tempo); outlet(3, 'play_state', D.song.playing ? 1 : 0);
    outlet(3, 'beat_position', D.song.playing ? D.song.position : D.beat);
    outlet(3, 'ts_num', D.song.num); outlet(3, 'ts_denom', D.song.den);
  }
}
function midiToGen(data) {
  if (!GEN.mq) return;
  var at = 1 + 3 * (GEN.written % GEN.CAP);
  GEN.mq.poke(1, at, [data[0], data[1], data[2]]);
  GEN.written++;
  GEN.mq.poke(1, 0, GEN.written);
}

function tick() {
  if (DEVICE.audio) {
    if ((D.frames++ & 63) === 0) readSong();
    if (D.midiIn.length) { D.midiIn.forEach(midiToGen); D.midiIn = []; }
    if ((D.frames % 5) === 0) toGen();
    if (ACTIONS.tick) ACTIONS.tick(fx);
    if ((D.frames & 511) === 0) save();
    return;
  }
  var now = Date.now();
  var ms = Math.min(100, Math.max(0, now - D.last));
  D.last = now;
  if ((D.frames++ & 63) === 0 || D.song.playing) readSong();
  var n = Math.max(1, Math.round(ms * SR / 1000));
  var spb = SR * 60 / D.song.tempo;
  fx.setTime({ tempo: D.song.tempo, num: D.song.num, den: D.song.den, playState: D.song.playing ? 1 : 0,
               beat: D.song.playing ? D.song.position : D.beat, seconds: (D.song.playing ? D.song.position : D.beat) * 60 / D.song.tempo });
  if (!D.song.playing) D.beat += n / spb;
  var midi = D.midiIn.map(function (data) { return { offset: 0, data: data }; });
  D.midiIn = [];
  var out = fx.process(n, null, null, midi);
  for (var i = 0; i < out.length; i++) send(out[i].data);
  if (ACTIONS.tick) ACTIONS.tick(fx);
  if ((D.frames & 511) === 0) save();
}
function start() {
  if (D.task) return;
  D.last = Date.now();
  D.task = new Task(tick, this);
  D.task.interval = 4;
  D.task.repeat();
  var draw = new Task(function () { mgraphics.redraw(); }, this);
  draw.interval = 33;
  draw.repeat();
  D.drawTask = draw;
}

// ------------------------------------------------------------ messages --
function bang() {
  D.ready = true;
  readSong();
  if (D.pending) { load(D.pending); D.pending = null; }
  start();
}
function restore(text) {
  var st = null;
  try { st = JSON.parse(String(text)); } catch (e) { return; }
  if (!D.ready) { D.pending = st; return; }
  load(st);
}
function load(st) {
  if (st && st.v === 1 && st.fx) { fx.deserialize(st.fx); fx.runSection('slider'); lastSaved = JSON.stringify(st); GEN.sent = {}; }
}
// The plug-in's @serialize, kept with the Live set: written when it changes,
// so an untouched device does not mark the set as changed.
var lastSaved = '';
function save() {
  var s = JSON.stringify({ v: 1, fx: fx.serialize() });
  if (s === lastSaved) return;
  lastSaved = s;
  outlet(1, 'set', s);
}
// The strip's buttons: "action <name>".
function action(name) {
  var a = ACTIONS[name];
  if (!a) return;
  try { var msg = a(fx, Live); if (msg) say(msg); } catch (e) { say(String(e.message || e)); }
  save();
  mgraphics.redraw();
}
// Keys typed while the window has focus, from its [key].
function key(code) { D.host.key(code); mgraphics.redraw(); }
function anything() {
  var a = ACTIONS[messagename];
  if (a) action(messagename);
}

// --------------------------------------------------------------- paint --
function size() {
  var r = (typeof box !== 'undefined' && box.rect) ? box.rect : [0, 0].concat(fx.file.gfxSize || [800, 600]);
  return [r[2] - r[0], r[3] - r[1]];
}
function paint() {
  var g = mgraphics, sz = size(), h = D.host;
  var clear = fx.getVar('gfx_clear');
  var c = clear >= 0 ? clear : 0;           // REAPER keeps the last frame for -1; a [v8ui] cannot
  var k = Gfx.clearColour(c);
  g.set_source_rgba(k[0], k[1], k[2], 1);
  g.rectangle(0, 0, sz[0], sz[1]);
  g.fill();
  if (D.menu) { frame(g, sz, D.menuMouse); drawMenu(g, sz); return; }
  var snap = new Float64Array(fx.v);
  var mouse = { x: D.mouse.x, y: D.mouse.y, cap: D.mouse.cap, wheel: D.mouse.wheel };
  D.mouse.wheel = 0;
  frame(g, sz, mouse);
  D.frameSaw = true;
  if (D.release) { D.release = false; D.mouse.cap = 0; }
  if (h.menu) { D.menu = { items: Gfx.parseMenu(h.menu.text), x: mouse.x, y: mouse.y, hover: -1 }; D.menuSnap = snap; D.menuMouse = mouse; }
}
function frame(g, sz, mouse) {
  D.host.begin(g, fx);
  D.host.mouseIn = mouse.x >= 0 && mouse.y >= 0 && mouse.x < sz[0] && mouse.y < sz[1];
  try { fx.runGfx(D.host, sz[0], sz[1], mouse); } catch (e) { say('The window stopped: ' + (e.message || e)); }
}

// The menu gfx_showmenu asked for, over the window.
var ITEM_H = Gfx.ITEM_H;
function menuRect(sz) {
  var m = D.menu, w = 40;
  mgraphics.select_font_face('Arial', 'normal', 'normal');
  mgraphics.set_font_size(12);
  m.items.forEach(function (it) { if (it.label) w = Math.max(w, mgraphics.text_measure(it.label)[0] + 40 + it.depth * 12); });
  var h = m.items.length * ITEM_H + 8;
  var x = Math.min(m.x, sz[0] - w - 2), y = Math.min(m.y, sz[1] - h - 2);
  return [Math.max(0, x), Math.max(0, y), w, h];
}
function drawMenu(g, sz) {
  g.select_font_face('Arial', 'normal', 'normal'); g.set_font_size(12);
  Gfx.drawMenu(g, menuRect(sz), D.menu.items, D.menu.hover);
}
function menuAt(x, y) {
  var r = menuRect(size());
  if (x < r[0] || x >= r[0] + r[2] || y < r[1] + 4 || y >= r[1] + r[3] - 4) return -1;
  return Math.floor((y - r[1] - 4) / ITEM_H);
}
function chooseMenu(i) {
  var m = D.menu, it = i >= 0 ? m.items[i] : null;
  if (it && (!it.index || it.grey)) return;          // a title, a rule or a greyed item: the menu stays
  D.menu = null;
  // The frame that asked runs again from where it started, and gets the answer.
  fx.v.set(D.menuSnap);
  D.host.choice = it ? it.index : 0;
  if (!it) { D.host.choice = 0; D.host.cancelled = true; }
  var g = mgraphics, sz = size();
  if (it) frame(g, sz, D.menuMouse);
  D.host.choice = 0;
  D.mouse.cap = 0;
  save();
  mgraphics.redraw();
}

// --------------------------------------------------------------- mouse --
// REAPER's mouse_cap: 1 left, 2 right, 4 Command, 8 Shift, 16 Option, 32 Control.
function caps(but, cmd, shift, opt, ctrl) {
  return (ctrl ? 2 : 1) | (cmd ? 4 : 0) | (shift ? 8 : 0) | (opt ? 16 : 0);
}
function onclick(x, y, but, cmd, shift, capslock, opt, ctrl) {
  if (D.menu) { chooseMenu(menuAt(x, y)); return; }
  D.mouse.x = x; D.mouse.y = y; D.mouse.cap = caps(but, cmd, shift, opt, ctrl);
  D.frameSaw = false;
  mgraphics.redraw();
}
function ondrag(x, y, but) {
  if (D.menu) return;
  D.mouse.x = x; D.mouse.y = y;
  if (!but) {
    // A click shorter than a frame is still seen down for one frame.
    if (D.frameSaw) D.mouse.cap = 0; else D.release = true;
    save();
  }
  mgraphics.redraw();
}
function onidle(x, y) {
  if (D.menu) { var i = menuAt(x, y); if (i !== D.menu.hover) { D.menu.hover = i; mgraphics.redraw(); } return; }
  D.mouse.x = x; D.mouse.y = y;
}
function onidleout() { if (!D.menu) { D.mouse.x = -1; D.mouse.y = -1; } }
function onwheel(x, y, dx, dy) { D.mouse.wheel += Math.round(dy * 120); mgraphics.redraw(); }

