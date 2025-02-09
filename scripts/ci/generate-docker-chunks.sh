#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck disable=SC1091
source "$DIR"/_common.sh

chunks='[]'
for target in "$@"; do
  affected_chunks=$("$PROJECT_ROOT"/scripts/ci/generate-chunks.sh "$target")
  if [[ "$affected_chunks" != "" ]]; then
    processed_chunks=$(echo "$affected_chunks" | jq -r '.[]' | while read -r project_list; do
      IFS=',' read -ra projects <<<"$project_list"
      for project in "${projects[@]}"; do
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
      done
    done | jq -s '.')
    chunks=$(echo "$chunks" | jq -cM --argjson new_chunks "$processed_chunks" '. + $new_chunks')
  fi
done

>&2 echo "Map: ${chunks}"
echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
