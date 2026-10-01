#!/usr/bin/env bash
# Build a headless JSFX host so the plugin can be run, measured and rendered
# without REAPER. Uses ysfx (the JSFX engine from the ysfx/Carla projects,
# which embeds the same EEL2 JIT as REAPER).
#
#   tools/build_host.sh          -> tools/build/render, tools/build/inspect, tools/build/gui
#
# The gui tool runs @gfx and needs the graphics build (freetype, fontconfig).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
B="$HERE/build"
mkdir -p "$B"
if [ ! -d "$B/ysfx" ]; then
  git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/JoepVanlier/ysfx "$B/ysfx"
fi
cmake -S "$B/ysfx" -B "$B/ysfx/build" -DCMAKE_BUILD_TYPE=Release -DYSFX_PLUGIN=OFF -DYSFX_GFX=OFF > "$B/cmake.log"
cmake --build "$B/ysfx/build" -j"$(nproc 2>/dev/null || echo 2)" > "$B/build.log"
LIBS=$(find "$B/ysfx/build" -name "*.a" ! -name libysfx.a)
for t in render inspect; do
  g++ -O2 -std=c++17 -I"$B/ysfx/include" "$HERE/$t.cpp" "$B/ysfx/build/libysfx.a" $LIBS -lpthread -ldl -o "$B/$t"
done
cmake -S "$B/ysfx" -B "$B/ysfx/build-gfx" -DCMAKE_BUILD_TYPE=Release -DYSFX_PLUGIN=OFF -DYSFX_GFX=ON > "$B/cmake-gfx.log"
cmake --build "$B/ysfx/build-gfx" -j"$(nproc 2>/dev/null || echo 2)" > "$B/build-gfx.log"
g++ -O2 -std=c++17 -I"$B/ysfx/include" "$HERE/gui.cpp" "$B/ysfx/build-gfx/libysfx.a" -lfreetype -lfontconfig -lpthread -ldl -o "$B/gui"
echo "built: $B/render $B/inspect $B/gui"
