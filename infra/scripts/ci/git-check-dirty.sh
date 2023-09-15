#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"
rel_path=$1
abs_path=$DIR/$rel_path
action=$2
owner="${3:-github actions}"

commit_as_github_actions() {
  git config user.name 'github-actions[bot]'
  git config user.email 'github-actions[bot]@users.noreply.github.com'
}

commit_as_dirty_bot() {
  git config user.name 'andes-it'
  git config user.email 'builders@andes.is'
}

if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "changes found in $rel_path that will be commited"
  git diff "$abs_path"
  git add "$abs_path"
  if [ "$owner" == "github actions" ]; then
    commit_as_github_actions
  elif [ "$owner" == "dirtybot" ]; then
    commit_as_dirty_bot
  else
    echo "Error: Unknown owner!"
    exit 1
  fi
  git commit -m "chore: $action update dirty files"
  git push
else
  echo "found no unstaged files from $action, nothing to commit"
fi

