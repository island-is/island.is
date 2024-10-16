#!/bin/bash

# Self-call with parameters
if [ $# -eq 0 ]; then
  RELEASE_IDS="$(git branch -r --list 'origin/release/*' | cut -d '/' -f 3 | sort -nr | head -n 2 | sort)"
  RELEASE_BRANCHES="$(echo "${RELEASE_IDS}" | awk '{print "release/"$1 }' | paste -s -d' ' -)"
  echo "Release branches to diff: ${RELEASE_BRANCHES}"
  # shellcheck disable=SC2086
  $0 ${RELEASE_BRANCHES} # No-quoting to get space-splitting
  # ./infra/scripts/helm-diff.sh release/<last-release-version> release/<new-release-version>
  exit $?
fi

# Requirements:
# Install ydiff
# - brew install ydiff
# - pip install --upgrade ydiff
# https://github.com/ymattw/ydiff

if ! command -v ydiff &>/dev/null; then
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

OLD_RELEASE_VALUES="$(mktemp -t "helm-diff.${1##*/}.XXXXXX")"
NEW_RELEASE_VALUES="$(mktemp -t "helm-diff.${2##*/}.XXXXXX")"
# curl https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml | jq -r ".content" | base64 --decode
curl -s -H "Accept: application/json" "https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml?ref=${1}" | jq -r ".content" | base64 --decode >"${OLD_RELEASE_VALUES}"
curl -s -H "Accept: application/json" "https://api.github.com/repos/island-is/island.is/contents/charts/islandis/values.prod.yaml?ref=${2}" | jq -r ".content" | base64 --decode >"${NEW_RELEASE_VALUES}"
diff -u "${OLD_RELEASE_VALUES}" "${NEW_RELEASE_VALUES}" | ydiff -w 0 -s
