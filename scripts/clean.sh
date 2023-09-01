#!/bin/bash

set -euo pipefail

CLEAN_DRY=false
CLEAN_CACHES=false
CLEAN_YARN=false
CLEAN_GENERATED=false
CLEAN_CACHES_LIST=(.cache node_modules dist infra/node_modules)
CLEAN_YARN_IGNORES_LIST=(patches releases)

log() {
  echo "$@" >&2
}

# Allow never being passed arguments
# shellcheck disable=SC2120
dry() {
  if [[ $# -eq 0 ]]; then
    if [[ "$CLEAN_DRY" == "true" ]]; then
      return 0
    else
      return 1
    fi
  fi
  if [[ "$CLEAN_DRY" == "true" ]]; then
    log "DRY: $*"
  else
    "$@"
  fi
}

show_help() {
  cat <<EOF
Usage: $(basename "$0") [OPTION]...

    -n, --dry         dry run
    --generated       clean generated files
    --yarn            clean yarn files
    --cache           clean cache files
    -h, --help        display this help and exit
EOF
}

cli() {
  while [[ $# -gt 0 ]]; do
    local arg="${1:-}"
    case "$arg" in
    --generated)
      CLEAN_GENERATED=true
      ;;
    --yarn)
      CLEAN_YARN=true
      ;;
    --cache)
      CLEAN_CACHES=true
      ;;
    -n | --dry)
      CLEAN_DRY=true
      ;;
    *)
      show_help
      exit
      ;;
    esac
    shift
  done
  if [[ "$CLEAN_GENERATED" == "false" && "$CLEAN_YARN" == "false" && "$CLEAN_CACHES" == "false" ]]; then
    CLEAN_GENERATED=true
    CLEAN_YARN=true
    CLEAN_CACHES=true
  fi
}

clean_generated() {
  dry find . -type f \( -name "openapi.yaml" \
    -o -name "api.graphql" \
    -o -name "schema.d.ts" \
    -o -name "schema.tsx" \
    -o -name "schema.ts" \
    -o -path "*/gen/graphql.ts" \
    -o -name "possibleTypes.json" \
    -o -name "fragmentTypes.json" \
    \) -delete

  dry find . -type d \( -path "*/gen/fetch" \
    \) -exec "$(dry && echo 'echo')" rm -rf '{}' +
}

clean_caches() {
  dry rm -rf "${CLEAN_CACHES_LIST[@]}"
}

clean_yarn() {
  if ! [[ -d ".yarn" ]]; then
    log "No .yarn folder"
    return
  fi
  for f in ./.yarn/*; do
    if [[ "$f" == '.yarn/*' ]]; then
      log "Nothing in .yarn folder"
      return
    fi
    fname="${f##*.yarn/}"
    if ! [[ "${CLEAN_YARN_IGNORES_LIST[*]}" =~ ${fname} ]]; then
      dry rm -rf "$f"
    fi
  done
}

clean_all() {
  for job in generated caches yarn; do
    job_uppercase=$(echo $job | tr '[:lower:]' '[:upper:]')
    job_variable="CLEAN_${job_uppercase}"

    # Run only if corresponding job variable is true
    if [[ "${!job_variable}" == "true" ]]; then
      log "Cleaning $job files"
      clean_job="clean_${job}"
      $clean_job || log "Job $job failed"
    else
      log "Skipping $job"
    fi
  done
}

cli "$@"
if (return 2>/dev/null); then
  echo "Exiting without running (only parsed arguments) because the script was sourced."
  echo "Run the script with './scripts/clean.sh' to actually clean 😊 "
  return
fi
clean_all
