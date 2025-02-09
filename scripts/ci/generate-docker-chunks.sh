#!/bin/bash
set -euxo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck disable=SC1091
source "$DIR"/_common.sh

chunks='[]'
for target in "$@"; do
  affected_chunks=$("$PROJECT_ROOT"/scripts/ci/generate-chunks.sh "$target")
  if [[ "$affected_chunks" != "[]" ]]; then
    # Process each chunk (which may contain multiple projects)
    while IFS= read -r project_list; do
      IFS=',' read -ra projects <<<"$project_list"
      for project in "${projects[@]}"; do
        project_info=$(yarn nx show project "$project" --json)
        home=$(echo "$project_info" | jq -r '.root')
        dist=$(echo "$project_info" | jq -r '.targets.build.options.outputPath // ""')
        new_chunk=$(jq -n \
          --arg project "$project" \
          --arg home "$home" \
          --arg dist "$dist" \
          --arg docker_type "$target" \
          '{projects: $project, home: $home, dist: $dist, docker_type: $docker_type}')
        chunks=$(echo "$chunks" | jq -c '. + ['"$new_chunk"']')
      done
    done < <(echo "$affected_chunks" | jq -r '.[]')
  fi
done

>&2 echo "Map: ${chunks}"
echo "$chunks"
