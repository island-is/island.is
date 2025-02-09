#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck disable=SC1091
source "$DIR"/_common.sh

chunks='[]'
for target in "$@"; do
  affected_apps=$("$DIR"/_nx-affected-targets.sh "$target")
  if [[ -n "$affected_apps" ]]; then
    processed_chunks=$(echo "$affected_apps" | tr ',' '\n' | while read -r project; do
      home=$(yarn nx show project "$project" | jq -r '.root')
      dist=$(yarn nx show project "$project" | jq -r '.targets.build.options.outputPath')
      if [[ -n "$dist" ]]; then
        jq -n \
          --arg project "$project" \
          --arg docker_type "$target" \
          --arg home "$home" \
          --arg dist "$dist" \
          '{projects: $project, docker_type: $docker_type, home: $home, dist: $dist}'
      fi
    done | jq -s '.')
    chunks=$(echo "$chunks" | jq -cM --argjson new_chunks "$processed_chunks" '. + $new_chunks')
  fi
done

>&2 echo "Map: ${chunks}"
echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
