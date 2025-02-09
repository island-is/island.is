#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck disable=SC1091
source "$DIR"/_common.sh
export HEAD=${HEAD:-HEAD}
export BASE=${BASE:-main}
export MAX_JOBS='100'

# Function to process a single project
process_project() {
  local project=$1
  local docker_type=$2
  local home
  home=$(yarn nx show project "$project" | jq -r '.root')
  local dist
  dist=$(yarn nx show project "$project" | jq -r '.targets.build.options.outputPath')
  if [[ -n "$dist" ]]; then
    jq -n \
      --arg project "$project" \
      --arg docker_type "$docker_type" \
      --arg home "$home" \
      --arg dist "$dist" \
      '{projects: $project, docker_type: $docker_type, home: $home, dist: $dist}'
  fi
}

export -f process_project

chunks='[]'
for target in "$@"; do
  affected_apps=$(yarn nx show projects --withTarget="$target" --affected --base "$BASE" --head "$HEAD" --json | jq -r 'join(",")')
  if [[ -n "$affected_apps" ]]; then
    processed_chunks=$(echo "$affected_apps" | tr ',' '\n' |
      xargs -I {} -P "${MAX_JOBS}" bash -c "process_project '{}' '$target'" |
      jq -s '.')
    chunks=$(echo "$chunks" | jq -cM --argjson new_chunks "$processed_chunks" '. + $new_chunks')
  fi
done

>&2 echo "Map: ${chunks}"
echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
