#!/bin/bash

set -euo pipefail

if [[ $# -ne 0 ]] && [[ $# -ne 2 ]]; then
  # Allow 0 or 2 arguments only
  echo "Usage: $0 [<from-branch> <to-branch>]"
  echo "Example:"
  echo "  $0 release/3.2.1 release/3.3.0"
  exit 1
fi

# # Empty-call to ensure it's installed
# echo "Verifying 'generate-changelog' is installed..."
# npx generate-changelog

# List of preferred copy tools
copy_tools=("xclip" "wl-copy" "pbcopy")

# Find the first available tool
for tool in "${copy_tools[@]}"; do
  if command -v "$tool" >/dev/null 2>&1; then
    selected_tool="$tool"
    break
  fi
done

# Check if a tool was found
if [[ -z "$selected_tool" ]]; then
  echo "No suitable copy tool found. Please install xclip, wl-copy, or pbcopy for automatic clipboard copying."
  selected_tool="tee"
fi

# Get two most recent release branches
branches=("$@")
if [[ ${#branches[@]} -eq 0 ]]; then
  while IFS= read -r line; do
    echo -ne "Found ${#branches[@]} branches\r"
    branches+=("$line")
  done < <(git fetch &>/dev/null && git for-each-ref --sort=-committerdate refs/remotes/origin/release/ --format='%(refname:short)' | head -n2)
fi
echo -e "Found ${#branches[@]} branches in total"
echo "Branches found: ${branches[*]}"
# branches_morphed=()
# for branch in "${branches[@]}"; do
#   if ! [[ "${branch}" =~ origin/* ]]; then
#     echo "Parsing branch $branch as a remote branch"
#     branch="origin/${branch}"
#   fi
#   branches_morphed+=("$branch")
# done
# branches=("${branches_morphed[@]}")
# echo "Branches found: ${branches[*]}"

# Verify that the branches exist
nonexistent_branches=()
for branch in "${branches[@]}"; do
  if ! git rev-parse --verify "$branch" &>/dev/null; then
    echo "Branch $branch not found"
    nonexistent_branches+=("$branch")
  fi
done
if [[ ${#nonexistent_branches[@]} -ne 0 ]]; then exit 1; fi

(
  set -x
  npx generate-changelog -t "${branches[1]}".."${branches[0]}" -a -f - | "$selected_tool"
)

echo "Changelog copied to clipboard using $selected_tool"
