#!/usr/bin/env bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"

# Defaults
owner="github actions"
rel_path=""
actions=()
positional_args=()

show_help() {
  cat <<EOF
Usage: $0 [OPTIONS] [<rel_path> <action> [<owner>]]

Options:
  -p, --path <path>        Path to track changes on
  -a, --action <action>    Action(s) to be performed (can be repeated)
  -o, --owner <owner>      Owner name (default: "github actions")
  -h, --help               Show this help message

Example usage:
  $0 my/path someAction dirtybot
  $0 --path my/path --action someAction --action anotherAction --owner dirtybot
EOF
  exit 0
}

# Parse flags
while [[ $# -gt 0 ]]; do
  case "$1" in
  -p | --path)
    rel_path="$2"
    shift 2
    ;;
  -a | --action)
    actions+=("$2")
    shift 2
    ;;
  -o | --owner)
    owner="$2"
    shift 2
    ;;
  -h | --help)
    show_help
    ;;
  # Collect remaining as positional
  *)
    positional_args+=("$1")
    shift
    ;;
  esac
done

# Backwards compatibility:
# If the user didn't specify flags, we interpret positional arguments
# in the old style: [rel_path] [action] [owner]
if [[ ${#positional_args[@]} -ge 1 ]]; then
  rel_path="${positional_args[0]}"
fi
if [[ ${#positional_args[@]} -ge 2 ]]; then
  actions+=("${positional_args[1]}")
fi
if [[ ${#positional_args[@]} -ge 3 ]]; then
  owner="${positional_args[2]}"
fi

abs_path="$DIR/$rel_path"

commit_as_github_actions() {
  git config user.name 'github-actions[bot]'
  git config user.email 'github-actions[bot]@users.noreply.github.com'
}

commit_as_dirty_bot() {
  git config user.name 'andes-it'
  git config user.email 'builders@andes.is'
}

# Forward everything to yarn.
# If you only want to forward flags (and not the old positional arguments), you can pass just "$@".
yarn "${actions[@]}"

if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "Changes found in $rel_path that will be committed:"
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

  commit_message="chore: ${actions[*]} update dirty files"
  git commit -m "$commit_message"
  git push
else
  echo "Found no unstaged files from ${actions[*]:-unknown}, nothing to commit."
fi
