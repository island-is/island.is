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
Usage:

Old (positional) usage (backwards-compatible):
  $0 <rel_path> [<actions>] [<owner>]
  Example:
    $0 my/path "build test" dirtybot

Flag-based usage:
  $0 [OPTIONS] --action <action1> [action2 ...]

Options:
  -p, --path <path>        Relative path to track changes on
  -o, --owner <owner>      Git owner name (default: "github actions")
  -a, --action <values...> One or more actions (build, test, etc.)
                           Provide multiple actions separated by spaces
  -h, --help               Show this help message

Examples:
  $0 --path my/path --action build test --owner dirtybot
  $0 my/path "build test" dirtybot
EOF
  exit 0
}

# CLI parsing
while [[ $# -gt 0 ]]; do
  case "$1" in
  -p | --path)
    rel_path="$2"
    shift 2
    ;;
  -o | --owner)
    owner="$2"
    shift 2
    ;;
  -a | --action)
    # Consume everything until the next dash-option or end of line
    shift
    while [[ $# -gt 0 && ! "$1" =~ ^- ]]; do
      actions+=("$1")
      shift
    done
    ;;
  -h | --help)
    show_help
    ;;
  *)
    # Anything that doesn't match a flag goes into positional_args
    positional_args+=("$1")
    shift
    ;;
  esac
done

# Backwards-compatibility block for old usage (if no flags were used):
#   script.sh <rel_path> [<action(s)>] [<owner>]
#
# - If the user only specified positionals, parse them in the old way.
# - This also allows a "mixed" scenario, but typically one uses all flags or none.
if [[ -n "${positional_args[*]}" && "${#actions[@]}" -eq 0 ]]; then
  # At least 1 positional => rel_path
  if [[ ${#positional_args[@]} -ge 1 ]]; then
    rel_path="${positional_args[0]}"
  fi
  # At least 2 => actions (possibly space-separated in quotes)
  if [[ ${#positional_args[@]} -ge 2 ]]; then
    # We split the second positional argument on spaces to get multiple actions
    IFS=' ' read -r -a old_actions <<<"${positional_args[1]}"
    actions=("${old_actions[@]}")
  fi
  # At least 3 => owner
  if [[ ${#positional_args[@]} -ge 3 ]]; then
    owner="${positional_args[2]}"
  fi
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

# ---------------
# RUN THE ACTIONS
# ---------------
yarn "${actions[@]}"

# ---------------
# CHECK & COMMIT
# ---------------
if [[ $(git diff --stat "$abs_path") != '' ]]; then
  echo "Changes found in $rel_path that will be committed."
  git diff "$abs_path"
  git add "$abs_path"

  case "$owner" in
  "github actions")
    commit_as_github_actions
    ;;
  "dirtybot")
    commit_as_dirty_bot
    ;;
  *)
    echo "Error: Unknown owner '$owner'!"
    exit 1
    ;;
  esac

  # Join all actions into a single commit message
  commit_message="chore: ${actions[*]} update dirty files"
  git commit -m "$commit_message"
  git push
else
  echo "Found no unstaged files from actions: '${actions[*]}' - nothing to commit."
fi
