#!/bin/bash

set -euo pipefail

# Configuration variables
: "${CLEAN_DRY:=false}"
: "${CLEAN_CACHES:=false}"
: "${CLEAN_YARN:=false}"
: "${CLEAN_GENERATED:=false}"
: "${CLEAN_NODE_MODULES:=false}"
: "${CLEAN_ALL:=false}"
CLEAN_CACHES_LIST=(.cache dist)
CLEAN_YARN_IGNORES_LIST=(patches releases)

log() {
  echo "$@" >&2
}

dry() {
  if [[ "$CLEAN_DRY" == "true" ]]; then
    log "Dry run: $*"
    return 0
  else
    return 1
  fi
}

show_help() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  --generated        Clean generated files
  --yarn             Clean yarn files
  --cache            Clean cache files
  --node-modules     Clean node_modules folder
  --all              Clean all (generated, yarn, cache, and node_modules files)
  -n, --dry          Dry run (show what would be done without actually doing it)
  -h, --help         Show this help message
EOF
}

cli() {
  if [[ $# -eq 0 ]]; then
    show_help
    exit 0
  fi

  while [[ $# -gt 0 ]]; do
    case "$1" in
    --generated) CLEAN_GENERATED=true ;;
    --yarn) CLEAN_YARN=true ;;
    --cache) CLEAN_CACHES=true ;;
    --node-modules) CLEAN_NODE_MODULES=true ;;
    --all) CLEAN_ALL=true ;;
    -n | --dry) CLEAN_DRY=true ;;
    -h | --help)
      show_help
      exit 0
      ;;
    *)
      show_help
      exit 1
      ;;
    esac
    shift
  done

  if [[ "$CLEAN_ALL" == "true" ]]; then
    CLEAN_GENERATED=true
    CLEAN_YARN=true
    CLEAN_CACHES=true
    CLEAN_NODE_MODULES=true
  fi
}

clean_generated() {
  local patterns=(
    "openapi.yaml"
    "api.graphql"
    "schema.d.ts"
    "schema.tsx"
    "schema.ts"
    "*/gen/graphql.ts"
    "*/*.generated.ts"
    "possibleTypes.json"
    "fragmentTypes.json"
  )

  for pattern in "${patterns[@]}"; do
    if dry "Would delete: $pattern"; then
      find . -not -path "./.cache/*" -type f -path "$pattern" -print
    else
      log "Deleting now: $pattern"
      find . -not -path "./.cache/*" -type f -path "$pattern" -delete
    fi
  done

  local dirs_to_delete="*/gen/fetch"
  if dry "Would delete directory: $dirs_to_delete"; then
    find . -not -path "./.cache/*" -type d -path "$dirs_to_delete" -print
  else
    log "Deleting directory now: $dirs_to_delete"
    find . -not -path "./.cache/*" -type d -path "$dirs_to_delete" -exec rm -rf '{}' +
  fi
}

clean_caches() {
  for item in "${CLEAN_CACHES_LIST[@]}"; do
    if dry "Would delete: $item"; then
      continue
    else
      log "Deleting now: $item"
      rm -rf "$item"
    fi
  done
}

clean_yarn() {
  if [[ ! -d ".yarn" ]]; then
    log "No .yarn folder"
    return
  fi

  for f in ./.yarn/*; do
    if [[ "$f" == '.yarn/*' ]]; then
      log "Nothing in .yarn folder"
      return
    fi

    local fname="${f##*/}"
    # Match the name literally, as a substring
    # shellcheck disable=SC2076
    if [[ ! " ${CLEAN_YARN_IGNORES_LIST[*]} " =~ " ${fname} " ]]; then
      if dry "Would delete: $f"; then
        continue
      else
        log "Deleting now: $f"
        rm -rf "$f"
      fi
    fi
  done
}

clean_node_modules() {
  if dry "Would delete: node_modules"; then
    return
  else
    log "Deleting now: node_modules"
    rm -rf node_modules
  fi
}

clean_all() {
  local jobs=("generated" "caches" "yarn" "node_modules")

  for job in "${jobs[@]}"; do
    local job_var
    job_var="CLEAN_$(echo $job | tr '[:lower:]' '[:upper:]')"
    if [[ "${!job_var}" == "true" ]]; then
      log "Cleaning $job files"
      "clean_$job"
    else
      log "Skipping $job"
    fi
  done
}

cli "$@"
clean_all
