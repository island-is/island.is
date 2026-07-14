#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

# Environment variables (set by CronJob)
 declare \
   DATABASE \
   DUMP_BUCKET \
   DUMP_REGION \
   SOURCE_DB_HOST
: "${DATABASE:?DATABASE is required}"
: "${DUMP_BUCKET:?DUMP_BUCKET is required}"
: "${DUMP_REGION:?DUMP_REGION is required}"
: "${SOURCE_DB_HOST:?SOURCE_DB_HOST is required}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_DIR="/tmp/dumps"

mkdir -p "$DUMP_DIR"

echo "========================================"
echo "IDS Dev Feature Database Dump - TEST MODE"
echo "========================================"
echo "Started at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "Database: $DATABASE"
echo "Host: $SOURCE_DB_HOST"
echo "Target: s3://$DUMP_BUCKET"
echo "========================================"

# CREATE TEST FILE INSTEAD OF DUMP
echo ""
echo "Creating test file..."
COMPRESSED_FILE="$DUMP_DIR/${DATABASE}-latest.sql.gz"
echo "test" | gzip > "$COMPRESSED_FILE"

# Get file size
COMPRESSED_SIZE=$(stat -c%s "$COMPRESSED_FILE" 2>/dev/null || stat -f%z "$COMPRESSED_FILE")
COMPRESSED_SIZE_BYTES=$COMPRESSED_SIZE

echo "✓ Test file created (${COMPRESSED_SIZE_BYTES} bytes)"

# Upload to S3 (overwrites previous dump)
echo ""
echo "Uploading to S3..."
if aws s3 cp "$COMPRESSED_FILE" \
  "s3://$DUMP_BUCKET/${DATABASE}-latest.sql.gz" \
  --region "$DUMP_REGION"; then
  
  # Create metadata file
  cat > "$DUMP_DIR/metadata.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "database": "$DATABASE",
  "source_host": "$SOURCE_DB_HOST",
  "test_mode": true,
  "compressed_size_bytes": $COMPRESSED_SIZE_BYTES
}
EOF
  
  # Upload metadata
  if ! aws s3 cp "$DUMP_DIR/metadata.json" \
    "s3://$DUMP_BUCKET/${DATABASE}-metadata.json" \
    --region "$DUMP_REGION"; then
    echo "✗ Failed to upload metadata to S3"
    rm -f "$COMPRESSED_FILE" "$DUMP_DIR/metadata.json"
    exit 1
  fi
  
  echo ""
  echo "========================================"
  echo "✓ TEST completed successfully!"
  echo "========================================"
  echo "Timestamp: $TIMESTAMP"
  echo "Test file size: ${COMPRESSED_SIZE_BYTES} bytes"
  echo "Uploaded to: s3://$DUMP_BUCKET/${DATABASE}-latest.sql.gz"
  echo "========================================"
  
  # Cleanup
  rm -f "$COMPRESSED_FILE"
  exit 0
else
  echo ""
  echo "✗ Failed to upload to S3"
  exit 1
fi
