#!/bin/bash

# Requirements:
# Install ydiff
# - brew install ydiff
# - pip install --upgrade ydiff
# https://github.com/ymattw/ydiff

if ! command -v ydiff &> /dev/null
then
    echo "Please install ydiff via pip or brew"
    echo "https://github.com/ymattw/ydiff"
    exit 1
fi

if [ -z "${1}" ]; then
    echo "Specify older commit/tag/branch"
    exit 1
fi
if [ -z "${2}" ]; then
    echo "Specify newer commit/tag/branch"
    exit 1
fi

# curl https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml | jq -r ".content" | base64 --decode
curl -s -H "Accept: application/json" 'https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml?ref='${1}'' | jq -r ".content" | base64 --decode > current-release.json
curl -s -H "Accept: application/json" 'https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml?ref='${2}'' | jq -r ".content" | base64 --decode > new-release.json
diff -u ./current-release.json ./new-release.json | ydiff -w 0 -s
rm -f ./new-release.json
rm -f ./current-release.json
