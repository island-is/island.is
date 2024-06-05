#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-tarball>"
  exit 1
fi

path=$1
shift

DIR="$(git rev-parse --show-toplevel)"
marker=$(mktemp)
touch "$marker"

CMD=yarn codegen --skip-cache 

$CMD "$@" 1>&2

# THIS IS VERY HACKISH AND MAKES IT DIFFICULT TO RUN ASYNC
changed_files=$(find "$DIR"/apps "$DIR"/libs -type d \( \
    -path "$DIR/node_modules" -o \
    -path "$DIR/**/node_modules" -o \
    -path "$DIR/cache" -o \
    -path "$DIR/cache_output" \
\) -prune -o -type f -newer "$marker" -print)

relative_paths=$(echo "$changed_files" | xargs realpath --relative-to "$DIR")

tar zcvf "$path" "$relative_paths"