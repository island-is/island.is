#!/bin/bash
# usage: consumers.sh <changed file> [symbol] [ref]; without a ref, searches the working tree
f=$1; sym=$2; ref=$3
if [ -n "$ref" ]; then
  files() { git ls-tree -r --name-only "$ref"; }
  show() { git show "$ref:$1"; }
  search() { git grep -l "$@" "$ref" -- 'libs/**' 'apps/**' '*.ts' '*.js' '*.mjs' | sed "s#^$ref:##"; }
else
  files() { git ls-files --cached --others --exclude-standard; }
  show() { cat "$1"; }
  search() { git grep -l --untracked "$@" -- 'libs/**' 'apps/**' '*.ts' '*.js' '*.mjs'; }
fi
roots=$(files | sed -n 's#/project.json$##p')
d=$(dirname "$f"); while [ "$d" != "." ] && ! grep -qxF "$d" <<<"$roots"; do d=$(dirname "$d"); done
aliases=$(show tsconfig.base.json | python3 -c "
import json,sys
p=json.load(sys.stdin)['compilerOptions']['paths']
print('\n'.join(k for k,v in p.items() if any(x.startswith(sys.argv[1]+'/') for x in v)))" "$d")
if [ "$d" = "." ] || [ -z "$aliases" ]; then
  # Not an importable library (a config-wired stub, an app file, a new lib): list files that reference it by path or name.
  b=$(basename "$f"); b=${b%.*}
  echo "no import alias for $f; files referencing '$b' by path:"
  search -E "[/'\"]${b}['\"./]" | grep -v "^$f$" | sort -u | head -40
  exit 0
fi
echo "library: $d  aliases:" $aliases
pats=(); while read -r a; do pats+=(-e "from '$a'"); done <<<"$aliases"
consumers=$(search -F "${pats[@]}" | grep -v "^$d/")
[ -n "$sym" ] && consumers=$(for x in $consumers; do show "$x" | grep -qw "$sym" && echo "$x"; done)
[ -z "$consumers" ] && { echo "no consumers outside $d"; exit 0; }
echo "$consumers" | grep -v '^$' \
 | awk 'NR==FNR { root[$0]; next } { p=$0; while (p ~ /\// && !(p in root)) sub(/\/[^\/]*$/, "", p); print p }' <(echo "$roots") - \
 | sort | uniq -c | sort -rn
