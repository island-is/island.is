#!/usr/bin/env bash
set -euo pipefail

# Config
DATABASE="${DATABASE:-servicesauth}"
SOURCE_DB_HOST="${SOURCE_DB_HOST:-localhost}"
DUMP_BUCKET="${DUMP_BUCKET:-island-is-ids-dev-feature-db-dumps}"
DUMP_REGION="${DUMP_REGION:-eu-west-1}"
DUMP_FILE="/tmp/dump.sql.gz"

# Get DB password from SSM
DB_PASSWORD=$(aws ssm get-parameter \
    --name "/k8s/servicesauth/DB_PASSWORD" \
    --with-decryption \
    --query 'Parameter.Value' \
    --region "$DUMP_REGION" \
    --output text)

# Create dump
echo "Creating database dump..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$SOURCE_DB_HOST" \
    -U "$DATABASE" \
    -d "$DATABASE" \
    --no-owner \
    --no-acl \
    | gzip > "$DUMP_FILE"

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$DUMP_FILE" "s3://${DUMP_BUCKET}/${DATABASE}-latest.sql.gz" --region "$DUMP_REGION"

# Verify upload succeeded
if [ $? -eq 0 ]; then
    echo "Upload successful"
else
    echo "Upload failed!" >&2
    exit 1
fi

# Cleanup
rm -f "$DUMP_FILE"
echo "Done!"