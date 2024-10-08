#!/bin/bash

set -euo pipefail

# Empty-call to ensure it's installed
echo "Verifying 'generate-changelog' is installed..."
npx generate-changelog

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

git fetch

# Get two most recent release branches
branches=()
n=0
while IFS= read -r line; do
  echo -ne "Found $((n++)) branches\r"
  branches+=("$line")
done < <(git for-each-ref --sort=-committerdate refs/heads/release/ --format='%(refname:short)' | head -n2)
echo -e "Found $n branches in total"
npx generate-changelog -t "${branches[1]}".."${branches[0]}" -a -f - | "$selected_tool"

echo "Changelog copied to clipboard using $selected_tool"
