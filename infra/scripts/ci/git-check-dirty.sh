#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"
rel_path=$1
abs_path=$DIR/$rel_path
action=$2

if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "changes found in $rel_path that will be commited"
  git diff "$abs_path"
  git config user.name 'github-actions[bot]'
  git config user.email 'github-actions[bot]@users.noreply.github.com'
  git add "$abs_path"
  git commit -m "chore: $action update dirty files"
  git push
else
  echo "found no unstaged files from $action, nothing to commit"
fi