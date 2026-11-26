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
  local image=$1 name raw
  name=$(basename "$image" | tr ':' '_')
  raw="$OUT/$name.raw.json"
  # Memory scan cache: parallel runs can't share the bolt cache.
  # All severities, so MEDIUM secrets are kept.
  if ! trivy image "$image" --quiet --skip-db-update \
    --cache-backend memory --image-src remote --platform linux/amd64 \
    --scanners vuln,secret --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
    --format json -o "$raw"; then
    echo "::error::Trivy failed for $image"
    return 1
  fi
  # Keep every secret, but only HIGH/CRITICAL vulnerabilities.
  jq '(.Results // []) |= map(
        if .Vulnerabilities then .Vulnerabilities |= map(
          select(.Severity == "HIGH" or .Severity == "CRITICAL"))
        else . end)' "$raw" > "$OUT/$name.json"
  rm -f "$raw"
}
export -f scan
export OUT

# shellcheck disable=SC2016 # $1 expands in the child bash
if ! grep '[^[:space:]]' "$LIST" | xargs -r -P "$JOBS" -n 1 bash -c 'scan "$1"' _; then
  echo "::error::Some image scans failed"
  exit 1
fi
