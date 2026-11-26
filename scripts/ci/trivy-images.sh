#!/usr/bin/env bash
# Scan pushed images with Trivy, a few at a time.
# Exits 1 if any scan failed; finished reports are kept.
# usage: trivy-images.sh <image-list-file> <report-dir>
set -euo pipefail

LIST=$1
OUT=$2
JOBS=${TRIVY_JOBS:-4}
mkdir -p "$OUT"

if ! grep -q '[^[:space:]]' "$LIST"; then
  echo "No images to scan."
  exit 0
fi

# Download once, so parallel scans don't race on the DB.
trivy image --download-db-only

scan() {
  local image=$1 name
  name=$(basename "$image" | tr ':' '_')
  # Memory scan cache: parallel runs can't share the bolt cache.
  if ! trivy image "$image" --quiet --skip-db-update \
    --cache-backend memory --image-src remote --platform linux/amd64 \
    --scanners vuln --format json -o "$OUT/$name.json"; then
    echo "::error::Trivy failed for $image"
    return 1
  fi
}
export -f scan
export OUT

# shellcheck disable=SC2016 # $1 expands in the child bash
if ! grep '[^[:space:]]' "$LIST" | xargs -r -P "$JOBS" -n 1 bash -c 'scan "$1"' _; then
  echo "::error::Some image scans failed"
  exit 1
fi
