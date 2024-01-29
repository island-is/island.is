#!/bin/bash

set -euo pipefail

: "${GITHUB_OUTPUT:=/dev/stdout}"
: "${CACHE_KEY_NODE:=}"
: "${CACHE_KEY_CODEGEN:=}"
: "${GIT_ROOT:=$(git rev-parse --show-toplevel)}"

warn() {
  echo "$@" >&2
}

show_help() {
  warn "Usage: $(basename "$0") [OPTIONS]"
  warn "Options:"
  warn " --node      Generate cache keys for node (modules)"
  warn " --codegen    Generate cache keys for codegen"
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
}

hash_files() {
  if [[ "$1" == '--' ]]; then shift; fi

  local -a files
  for pattern in "${@}"; do
    warn "Searching for files matching '$pattern'..."

    # Use 'read -r' to read each line without interpreting backslashes
    while IFS= read -r -d $'\0' file; do
      files+=("$file")

      # Ignore node_modules and .cache/
    done < <(find "$GIT_ROOT" -not -path "*/node_modules/*" -not -path "*/.cache/*" -path "$GIT_ROOT/$pattern" -print0)
  done

  # Check if files array is empty
  if [ ${#files[@]} -eq 0 ]; then
    warn "No files match the specified patterns."
    return 1
  fi

  # Combine files and pipe the output to sha256sum
  # The tar command runs in the git root directory to ensure paths are relative to the git root
  (cd "$GIT_ROOT" && tar 2>/dev/null -cf - --sort=name "${files[@]}" | (sha256sum || shasum) 2>/dev/null)
}

cache_key_node() {
  hash="$(hash_files -- **/node_modules **/yarn.lock **/package.json)"
  echo "node-modules-hash=$hash" >>"$GITHUB_OUTPUT"
  warn "Got cache key: $hash"
}

cache_key_codegen() {
  hash="$(
    hash_files -- \
      scripts/codegen.js \
      **/*.controller.ts \
      **/*.dto.ts \
      **/*.enum.ts \
      **/*.graphql \
      **/*.graphql.ts \
      **/*.input.ts \
      **/*.model.ts \
      **/*.module.ts \
      **/*.resolver.ts \
      **/*.service.ts \
      **/*.union.ts \
      **/clientConfig.* \
      **/codegen.* \
      **/codegen.yml \
      **/fragments/**/*.tsx \
      **/mutations/**/*.tsx \
      **/queries/**/*.tsx \
      apps/air-discount-scheme/web/components/AppLayout/AppLayout.tsx \
      apps/air-discount-scheme/web/components/Header/Header.tsx \
      apps/air-discount-scheme/web/i18n/withLocale.tsx \
      apps/air-discount-scheme/web/screens/**.tsx \
      apps/application/types/src/lib/ApplicationTypes.ts \
      apps/cms/src/lib/generated/contentfulTypes.d.ts \
      scripts/codegen.js

    # Original glob list for github's hashFiles
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

  )"
  echo "generated-files-cache-key=$hash" >>"$GITHUB_OUTPUT"
  warn "Got cache key: $hash"
}

main() {
  parse_cli "$@"
  if [ -n "$CACHE_KEY_NODE" ]; then
    warn "Calculating node cache key..."
    cache_key_node
  fi
  if [ -n "$CACHE_KEY_CODEGEN" ]; then
    warn "Calculating codegen cache key..."
    cache_key_codegen
  fi
}

if (return 0 2>/dev/null); then exit; fi
main "$@"
