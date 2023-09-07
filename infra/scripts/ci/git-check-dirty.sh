#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"
rel_path=$1
abs_path=$DIR/$rel_path
action=$2
github_token="${3:-GITHUB_TOKEN}"

REPO_URL="https://$github_token@github.com/island-is/island.is.git"
branch=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}

if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "changes found in $rel_path that will be commited"
  git diff "$abs_path"
  git add "$abs_path"
  git config user.name 'andes-it'
  git config user.email 'andes-it@andes.is'
  git commit -m "chore: $action update dirty files"
  git push "$REPO_URL" "${branch}"
else
  echo "found no unstaged files from $action, nothing to commit"
fi