#!/usr/bin/env bash
# Scan pushed images with Trivy, a few at a time. Report only.
# usage: trivy-images.sh <image-list-file> <report-dir>
set -euo pipefail

LIST=$1
OUT=$2
JOBS=${TRIVY_JOBS:-4}
mkdir -p "$OUT"

# Download once, so parallel scans don't race on the DB.
trivy image --download-db-only

scan() {
  local image=$1 name
  name=$(basename "$image" | tr ':' '_')
  # Memory scan cache: parallel runs can't share the bolt cache.
  if ! trivy image "$image" --quiet --skip-db-update \
    --cache-backend memory --image-src remote --platform linux/amd64 \
    --scanners vuln --format json -o "$OUT/$name.json"; then
    echo "::warning::Trivy failed for $image"
  fi
}
export -f scan
export OUT

# shellcheck disable=SC2016 # $1 expands in the child bash
grep -v '^$' "$LIST" | xargs -P "$JOBS" -n 1 bash -c 'scan "$1"' _
