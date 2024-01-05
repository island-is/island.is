#!/bin/bash

set -euo pipefail

# List of preferred copy tools
copy_tools=("xclip" "wl-copy" "pbcopy")

# Find the first available tool
for tool in "${copy_tools[@]}"; do
    if command -v "$tool" > /dev/null 2>&1; then
        selected_tool="$tool"
        break
    fi
done

# Check if a tool was found
if [[ -z "$selected_tool" ]]; then
    echo "No suitable copy tool found. Please install xclip, wl-copy, or pbcopy."
    exit 1
fi

git fetch

# Get two most recent release branches
mapfile -t branches < <(git for-each-ref --sort=-committerdate refs/heads/release/ --format='%(refname:short)' | head -n2)
npx generate-changelog -t "${branches[1]}".."${branches[0]}" -a -f - | $selected_tool

echo "Changelog copied to clipboard using $selected_tool"
