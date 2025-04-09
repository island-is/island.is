#!/bin/bash
# git-check-dirty.sh
# This script checks for changes in a specified file or directory, commits them using a specified user, and pushes the changes to the repository.
#
# Usage: ./git-check-dirty.sh <relative_path> <action> [owner]
# <relative_path>: The relative path to the file or directory to check for changes.
# <action>: A description of the action being performed, used in the commit message.
# [owner]: Optional. The user to commit as. Defaults to "github actions". Options are "github actions" or "dirtybot".

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

# Check for changes in the specified path, and commit if any
if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "Changes found in $rel_path that will be committed"
  git diff "$abs_path"
  git add "$abs_path"
  # Determine which user to commit as
  case "$owner" in
  "github actions")
    commit_as_github_actions
    ;;
  "dirtybot")
    commit_as_dirty_bot
    ;;
  *)
    echo "Error: Unknown owner!"
    exit 1
    ;;
  esac
  git commit -m "chore: $action update dirty files"
  git push
else
  echo "Found no unstaged files from $action, nothing to commit"
fi
