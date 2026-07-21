#!/bin/bash
set -euo pipefail

# Get DB password from SSM
DB_PASSWORD=$(node secrets get "$DB_PASSWORD_KEY")
export PGPASSWORD="$DB_PASSWORD"

# Check if database already has tables (skip if restored)
echo "Checking if database has existing tables..."
TABLE_COUNT=$(psql -h "$PGHOST" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
  echo "Database already has $TABLE_COUNT tables, skipping restore."
  exit 0
fi

echo "-----------restore key---------"
echo "restore key: $RESTORE_KEY"

# Download dump from S3
echo "Downloading dump from S3..."
DUMP_FILE="/tmp/restore.sql.gz"
aws s3 cp \
  "s3://${RESTORE_BUCKET}/${RESTORE_KEY}" \
  "$DUMP_FILE" \
  --region "eu-west-1"

# Restore dump
echo "Restoring database from dump..."
gunzip -c "$DUMP_FILE" | psql -h "$PGHOST" -U "$DB_USER" -d "$DB_NAME"

# Verify
TABLE_COUNT_AFTER=$(psql -h "$PGHOST" -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")

if [ "$TABLE_COUNT_AFTER" -gt 0 ]; then
  echo "Restore successful! Database now has $TABLE_COUNT_AFTER tables."
else
  echo "ERROR: Restore completed but no tables found!" >&2
  exit 1
fi

# Cleanup
rm -f "$DUMP_FILE"
echo "Restore complete."