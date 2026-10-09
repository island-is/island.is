#!/bin/bash
# usage: consumers.sh <changed file> [symbol] [ref]
f=$1; sym=$2; ref=${3:-HEAD}
d=$(dirname "$f"); while [ "$d" != "." ] && [ ! -f "$d/project.json" ]; do d=$(dirname "$d"); done
alias=$(python3 -c "
import json,sys
p=json.load(open('tsconfig.base.json'))['compilerOptions']['paths']
print(next((k for k,v in p.items() if any(x.startswith(sys.argv[1]+'/src/index') for x in v)),''))" "$d")
if [ "$d" = "." ] || [ -z "$alias" ]; then
  # Not an importable library (a config-wired stub, an app file, a new lib): list files that reference it by path or name.
  b=$(basename "$f"); b=${b%.*}
  echo "no import alias for $f; files referencing '$b' by path:"
  git grep -l -E "[/'\"]$b['\"./]" "$ref" -- 'libs/**' 'apps/**' '*.ts' '*.js' '*.mjs' | sed -E "s#^$ref:##" | grep -v "^$f$" | sort -u | head -40
  exit 0
fi
echo "library: $d  alias: $alias"
files=$(git grep -l -F "from '$alias'" "$ref" -- 'libs/**' 'apps/**' | sed -E "s#^$ref:##" | grep -v "^$d/")
[ -n "$sym" ] && files=$(for x in $files; do git show "$ref:$x" | grep -qw "$sym" && echo "$x"; done)
echo "$files" | grep -v '^$' \
 | awk -F/ '{ if ($2=="application" && $3=="templates") print $1"/"$2"/"$3"/"$4; else print $1"/"$2"/"$3 }' | sort | uniq -c | sort -rn
