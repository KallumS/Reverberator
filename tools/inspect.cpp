// Load a JSFX, set sliders, run blocks, print variables and memory ranges.
// usage: inspect fx.jsfx srate "var1,var2" "addr:count,..." [slider=value ...]
// env: NB = blocks to run, BS = block size, IMP = feed an impulse in block 0
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
int main(int argc,char**argv){
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)||!ysfx_compile(fx,0)) return 2;
  ysfx_set_sample_rate(fx,atof(argv[2])); ysfx_set_block_size(fx,getenv("BS")?atoi(getenv("BS")):64); ysfx_init(fx);
  for(int i=5;i<argc;i++){int idx;double v; if(sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true);}
  float z[64]={0}; const float*ins[2]={z,z}; float o1[64],o2[64]; float*outs[2]={o1,o2};
  int nb = getenv("NB") ? atoi(getenv("NB")) : 1;
  float imp[64]={0}; imp[0]=0.5f; const float*ins2[2]={imp,imp};
  for(int b=0;b<nb;b++) ysfx_process_float(fx, (b==0 && getenv("IMP")) ? ins2 : ins,outs,2,2,getenv("BS")?atoi(getenv("BS")):64);
  std::string vs=argv[3]; size_t p=0;
  while(p<vs.size()){ size_t q=vs.find(',',p); if(q==std::string::npos)q=vs.size(); std::string n=vs.substr(p,q-p); if(!n.empty()) printf("%s = %.9g\n",n.c_str(),ysfx_read_var(fx,n.c_str())); p=q+1; }
  std::string ms=argv[4]; p=0;
  while(p<ms.size()){ size_t q=ms.find(',',p); if(q==std::string::npos)q=ms.size(); std::string n=ms.substr(p,q-p); unsigned a,cn; if(sscanf(n.c_str(),"%u:%u",&a,&cn)==2){ std::vector<double> b(cn); ysfx_read_vmem(fx,a,b.data(),cn); printf("mem[%u..]:",a); for(double v:b) printf(" %.6g",v); printf("\n"); } p=q+1; }
  ysfx_free(fx); return 0;
}
