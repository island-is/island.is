#!/bin/bash
set -euo pipefail

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
        dist=$(echo "$project_info" | jq -r '.targets.build.options.outputPath')

        # Validate that dist (outputPath) exists and is not empty
        if [[ -z "$dist" ]]; then
          echo "Error: outputPath is empty for project $project" >&2
          exit 1
        fi

        new_chunk=$(jq -n \
          --arg project "$project" \
          --arg home "$home" \
          --arg dist "$dist" \
          --arg docker_type "$target" \
          '{projects: $project, docker_type: $docker_type, home: $home, dist: $dist}')
        chunks=$(echo "$chunks" | jq -c '. + ['"$new_chunk"']')
      done
    done < <(echo "$affected_chunks" | jq -r '.[]')
  fi
done

# Output the chunks as a JSON string
echo "$chunks" | jq -c 'map(to_entries | map("\(.key)=\(.value)") | join(",")) | join(" ")'
