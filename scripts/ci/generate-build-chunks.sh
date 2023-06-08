#!/bin/bash
set -euo pipefail
[[ -z "${CI:-}" ]] || set -x

source ./scripts/ci/_common.sh

chunks='[]'
for target in "$@"; do
  affected_chunks=$("$PROJECT_ROOT"/scripts/ci/generate-chunks.sh "$target")
  if [[ "$affected_chunks" != "" ]]; then
    chunks=$(echo "$chunks" | jq -cM --argjson target "$affected_chunks" '. + ($target | map({projects: ., docker_type: "'"$target"'"}))')
  fi
done

echo >&2 "Map: ${chunks}"
echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
