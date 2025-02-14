#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck disable=SC1091
source "$DIR"/_common.sh

# should be set by the caller or fail
export \
  HEAD=${HEAD_SHA} \
  BASE=${BASE_SHA} \
  MAX_JOBS='100'

if [[ -n "${CHUNKS_DEBUG:-}" ]]; then
  echo "$CHUNKS_DEBUG" | jq -cM '. | map("\(.|tostring)")'
  exit 0
elif [[ "${SKIP_TESTS:-}" == true ]]; then
  #Skipping tests
  echo "[]"
  exit 0
fi

chunks='[]'
for target in "$@"; do
  processed_chunks=$(yarn nx show projects --withTarget="$target" --affected --base "$BASE" --head "$HEAD" --json |
    jq -r '.[]' |
    xargs -I {} -P "${MAX_JOBS:-4}" bash -c "
      project=\"\$1\"
      docker_type=\"\$2\"
      project_info=\$(yarn nx show project \"\$project\" --json)
      home=\$(echo \"\$project_info\" | jq -r \".root\")
      dist=\$(echo \"\$project_info\" | jq -r \".targets.build.options.outputPath\")
      jq -n \
        --arg project \"\$project\" \
        --arg docker_type \"\$docker_type\" \
        --arg home \"\$home\" \
        --arg dist \"\$dist\" \
        '{projects: \$project, docker_type: \$docker_type, home: \$home, dist: \$dist}'
    " _ {} "$target" |
    jq -s '.')

  chunks=$(echo "$chunks" | jq -cM --argjson new_chunks "$processed_chunks" '. + $new_chunks')
done

>&2 echo "Map: ${chunks}"
echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
