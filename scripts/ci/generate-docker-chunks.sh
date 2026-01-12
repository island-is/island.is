#!/bin/bash
set -eo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck source-path=SCRIPTDIR
source "$DIR"/_common.sh
export MAX_JOBS='100'
chunks='[]'

if [[ "${SKIP_TESTS:-}" == true ]]; then
  #Skipping tests
  echo "$chunks"
  exit 0
fi

LAST_COMMIT_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD)
if echo "$LAST_COMMIT_FILES" | grep -q ".github/actions/force-build.mjs"; then
  export TEST_EVERYTHING=true
fi

if [[ (-n "$BRANCH" && -n "$AFFECTED_ALL" && "$AFFECTED_ALL" == "7913-$BRANCH") || (-n "$NX_AFFECTED_ALL" && "$NX_AFFECTED_ALL" == "true") || (-n "$TEST_EVERYTHING" && "$TEST_EVERYTHING" == "true") ]]; then
  EXTRA_ARGS=""
else
  EXTRA_ARGS=(--affected --base "$BASE" --head "$HEAD")
fi

for target in "$@"; do
  processed_chunks=$(yarn nx show projects --withTarget="$target" "${EXTRA_ARGS[@]}" --json |
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

if [[ -n "$ADDITIONAL_PROJECTS" ]]; then
  TMP_PROJ=$(yarn nx show projects -p "$ADDITIONAL_PROJECTS" --json)
  >&2 echo "Running additional projects: ${TMP_PROJ}"
  for target in "$@"; do
    >&2 echo "Target for additional projects: ${target}"
    processed_chunks=$(yarn nx show projects --withTarget="$target" -p "$ADDITIONAL_PROJECTS" --json |
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

    chunks=$(echo "$chunks" | jq -cM --argjson new_chunks "$processed_chunks" '. + $new_chunks | unique_by(.projects)')
  done
fi

>&2 echo "Additional projects: ${ADDITIONAL_PROJECTS}"
>&2 echo "Map: ${chunks}"
# echo "$chunks" | jq -cM '. | map("\(.|tostring)")'
echo "$chunks"
