#!/bin/bash

set -euo pipefail

: "${GITHUB_OUTPUT:=/dev/stdout}"
: "${CACHE_KEY_NODE:=}"
: "${CACHE_KEY_CODEGEN:=}"
: "${GIT_ROOT:=$(git rev-parse --show-toplevel)}"

log() {
  echo "$@" >&2
}

show_help() {
  log "Usage: $(basename "$0") [OPTIONS]"
  log "Options:"
  log " --node      Generate cache keys for node (modules)"
  log " --codegen    Generate cache keys for codegen"
}

parse_cli() {
  while [ $# -gt 0 ]; do
    opt=$1
    shift
    case $opt in
    --node)
      CACHE_KEY_NODE=1
      ;;
    --codegen)
      CACHE_KEY_CODEGEN=1
      ;;
    *)
      show_help
      exit 1
      ;;
    esac
  done
  if [[ -z "${CACHE_KEY_NODE}${CACHE_KEY_CODEGEN}" ]]; then
    log "Please specify at least one cache key type."
    show_help
    exit 1
  fi
}

hash_files() {
  if [[ "$1" == '--' ]]; then shift; fi

  local -a patterns=()
  for pattern in "$@"; do
    patterns+=(-o -path "$pattern") # Add the OR condition for multiple patterns
  done

  # Remove the first '-o' (OR operator) for the 'find' command to work correctly
  patterns=("${patterns[@]:1}")

  local -a files
  while IFS= read -r -d $'\0' file; do
    files+=("$file")
  done < <(
    find "$GIT_ROOT" \
      -not -path '*/node_modules/*' \
      -not -path '*/.cache/*' \
      -not -path '*/cache/*' \
      \( "${patterns[@]}" \) \
      -print0
  )

  log "Searching for files matching patterns: ${*}"

  # Check if files array is empty
  if [ -z "${files[*]}" ]; then
    log "No files match the specified patterns."
    return 1
  fi

  log "Found ${#files[@]} matching files."

  # Combine files and pipe the output to sha256sum or shasum
  # The tar command runs in the git root directory to ensure paths are relative to the git root
  (cd "$GIT_ROOT" && tar 2>/dev/null -cf - --sort=name "${files[@]}" | (sha256sum || shasum) 2>/dev/null)
}

cache_key_node() {
  hash="$(hash_files -- '**/node_modules' '**/yarn.lock' '**/package.json')"
  echo "node-modules-hash=$hash" >>"$GITHUB_OUTPUT"
  log "Got cache key: $hash"
}

cache_key_codegen() {
  file_patterns=(
    "scripts/codegen.js"
    "**/*.controller.ts"
    "**/*.dto.ts"
    "**/*.enum.ts"
    "**/*.graphql"
    "**/*.graphql.ts"
    "**/*.input.ts"
    "**/*.model.ts"
    "**/*.module.ts"
    "**/*.resolver.ts"
    "**/*.service.ts"
    "**/*.union.ts"
    "**/clientConfig.*"
    "**/codegen.*"
    "**/codegen.yml"
    "**/fragments/**/*.tsx"
    "**/mutations/**/*.tsx"
    "**/queries/**/*.tsx"
    "*/air-discount-scheme/web/components/AppLayout/AppLayout.tsx"
    "*/air-discount-scheme/web/components/Header/Header.tsx"
    "*/air-discount-scheme/web/i18n/withLocale.tsx"
    "*/air-discount-scheme/web/screens/**.tsx"
    "*/application/types/src/lib/ApplicationTypes.ts"
    "*/cms/src/lib/generated/contentfulTypes.d.ts"
  )
  hash="$(
    hash_files -- "${file_patterns[@]}"
  )"
  # Original glob list for github's hashFiles, kept here in for future reference.
  # apps/**/*.controller.ts \
  # apps/**/*.dto.ts \
  # apps/**/*.enum.ts \
  # apps/**/*.graphql.ts \
  # apps/**/*.input.ts \
  # apps/**/*.model.ts \
  # apps/**/*.module.ts \
  # apps/**/*.resolver.ts \
  # apps/**/*.service.ts \
  # apps/**/*.union.ts \
  # apps/**/codegen.yml \
  # apps/**/queries/**/*.tsx \
  # apps/air-discount-scheme/web/components/AppLayout/AppLayout.tsx \
  # apps/air-discount-scheme/web/components/Header/Header.tsx \
  # apps/air-discount-scheme/web/i18n/withLocale.tsx \
  # apps/air-discount-scheme/web/screens/**.tsx \
  # apps/judicial-system/**/*.graphql \
  # libs/**/*.controller.ts \
  # libs/**/*.dto.ts \
  # libs/**/*.enum.ts \
  # libs/**/*.graphql \
  # libs/**/*.graphql.ts \
  # libs/**/*.input.ts \
  # libs/**/*.model.ts \
  # libs/**/*.module.ts \
  # libs/**/*.resolver.ts \
  # libs/**/*.service.ts \
  # libs/**/*.union.ts \
  # libs/**/clientConfig.yaml \
  # libs/**/codegen.yml \
  # libs/**/fragments/**/*.tsx \
  # libs/**/mutations/**/*.tsx \
  # libs/**/queries/**/*.tsx \
  # libs/application/types/src/lib/ApplicationTypes.ts \
  # libs/cms/src/lib/generated/contentfulTypes.d.ts \
  # scripts/codegen.js
  echo "generated-files-cache-key=$hash" >>"$GITHUB_OUTPUT"
  log "Got cache key: $hash"
}

main() {
  parse_cli "$@"
  if [ -n "$CACHE_KEY_NODE" ]; then
    log "Calculating node cache key..."
    cache_key_node
  fi
  if [ -n "$CACHE_KEY_CODEGEN" ]; then
    log "Calculating codegen cache key..."
    cache_key_codegen
  fi
}

if (return 1 2>/dev/null); then exit; fi
main "$@"
