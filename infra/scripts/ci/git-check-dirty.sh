#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"
rel_path=$1
abs_path=$DIR/$rel_path
bot_name=$2

if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "changes found in $rel_path that will be commited by $bot_name"
  git diff "$abs_path"
  git config --global user.name "$bot_name"
  git config --global user.email "username@users.noreply.github.com"
  git commit -am "chore: $bot_name update dirty files"
  git push
else
  echo "$bot_name found no unstaged files, nothing to commit"
fi
