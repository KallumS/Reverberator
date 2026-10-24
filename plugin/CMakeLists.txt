# Reverberator as a VST3 and CLAP plugin: Reverberator.jsfx, unchanged, run
# by ysfx inside a small JUCE wrapper (source/). Build with plugin/build.sh,
# which fetches ysfx first; the workflow in .github/workflows does the same
# on a Mac.
cmake_minimum_required(VERSION 3.22)
set(CMAKE_OSX_DEPLOYMENT_TARGET "11.0" CACHE STRING "")
if(APPLE)
    set(CMAKE_OSX_ARCHITECTURES "arm64;x86_64" CACHE STRING "")
endif()
project(ReverberatorPlugin VERSION 1.0.0 LANGUAGES C CXX ASM)

# ---- what this plugin is -----------------------------------------------------
set(PLUG_NAME "Reverberator")
set(PLUG_JSFX "${CMAKE_CURRENT_SOURCE_DIR}/../Reverberator.jsfx")
set(PLUG_CODE "Rvrb")                       # four letters, unique to the maker
set(PLUG_ID "com.kallums.reverberator")
set(PLUG_IS_SYNTH FALSE)
set(PLUG_VST3_CATEGORIES Fx Reverb)
set(PLUG_CLAP_FEATURES audio-effect reverb stereo)
set(PLUG_TAIL_SECONDS 30)                   # the longest decays run for minutes
set(PLUG_MIN_W 560)                         # the window's own minimum
set(PLUG_MIN_H 360)
set(PLUG_BACKGROUND 0xff23272e)
# ------------------------------------------------------------------------------

set(YSFX_DIR "${CMAKE_CURRENT_SOURCE_DIR}/deps/ysfx" CACHE PATH "ysfx checkout (build.sh fetches it)")
set(JUCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/deps/JUCE" CACHE PATH "JUCE checkout (build.sh fetches it)")
include("${CMAKE_CURRENT_SOURCE_DIR}/wrapper.cmake")
