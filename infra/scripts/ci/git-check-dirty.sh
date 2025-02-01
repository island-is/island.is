#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"

show_help() {
  cat <<EOF
Usage:
  $0 <path> <action> <owner>
  $0 [options]

  The options -p, -a, -o are required if using the second form

Options:
  -p <path> path to the file to check
  -a <action> action to run
  -o <owner> owner to commit as
  -c check mode
  -r run mode
EOF
}

if [[ $# -eq 0 ]]; then
  show_help && exit 0
fi

rel_path=$1
abs_path=$DIR/$rel_path
action=$2
owner="${3:-github actions}"
check_mode="${CHECK_MODE:-}"
run_mode="${RUN_MODE:-}"

while getopts "p:a:o:crh" opt; do
  case $opt in
  p) abs_path="$DIR/$OPTARG" ;;
  a) action="$OPTARG" ;;
  o) owner="$OPTARG" ;;
  c) check_mode=true ;;
  r) run_mode=true ;;
  h) show_help && exit 0 ;;
  *) echo "Invalid option: -$OPTARG" >&2 ;;
  esac
done

for opt in "$abs_path" "$action" "$owner"; do
  if [[ -z "$opt" ]] || [[ "$opt" = -* ]]; then
    echo "A required argument is missing" >&2
    exit 1
  fi
done

commit_as_github_actions() {
  git config user.name 'github-actions[bot]'
  git config user.email 'github-actions[bot]@users.noreply.github.com'
}

commit_as_dirty_bot() {
  git config user.name 'andes-it'
  git config user.email 'builders@andes.is'
}

if [[ "$run_mode" == true ]]; then
  # Split action into array safely:
  IFS=' ' read -r -a action_array <<<"$action"
  if ! yarn "${action_array[@]}"; then
    echo "Error: Failed to execute yarn command: ${action_array[*]}" >&2
    exit 1
  fi
fi

if [[ "$check_mode" == true ]] && ! git diff --quiet; then
  echo "found unstaged files from $action, aborting"
  exit 1
fi
if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "changes found in $rel_path that will be commited"
  git diff "$abs_path" || true
  if [ "$owner" == "github actions" ]; then
    commit_as_github_actions
  elif [ "$owner" == "dirtybot" ]; then
    commit_as_dirty_bot
  else
    echo "Error: Unknown owner!"
    exit 1
  fi
  git commit -am "chore: update dirty files

  $action"
  git push
else
  echo "found no unstaged files from $action, nothing to commit"
fi
