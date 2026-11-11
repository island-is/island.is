#!/usr/bin/env bash
set -euo pipefail

DATABASE="${DATABASE:-servicesauth}"
SOURCE_DB_HOST="${SOURCE_DB_HOST:-localhost}"
DUMP_BUCKET="${DUMP_BUCKET:-island-is-ids-dev-feature-db-dumps}"
DUMP_REGION="${DUMP_REGION:-eu-west-1}"
# Output key: default preserves standalone behavior; wrapper passes RESTORE_KEY.
DUMP_KEY="${DUMP_KEY:-${DATABASE}-latest.sql.gz}"
DUMP_FILE="/tmp/dump.sql.gz"

# User to connect as. Wrapper overrides with the master user.
DUMP_DB_USER="${DUMP_DB_USER:-$DATABASE}"

# Password: use provided DUMP_DB_PASSWORD, else fall back to SSM (standalone).
if [[ -z "${DUMP_DB_PASSWORD:-}" ]]; then
    DUMP_DB_PASSWORD=$(aws ssm get-parameter \
    --name "/k8s/servicesauth/DB_PASSWORD" \
    --with-decryption \
    --query 'Parameter.Value' \
    --region "$DUMP_REGION" \
    --output text)
fi

echo "Creating database dump (user: $DUMP_DB_USER, db: $DATABASE)..."
    PGPASSWORD="$DUMP_DB_PASSWORD" pg_dump \
    -h "$SOURCE_DB_HOST" \
    -U "$DUMP_DB_USER" \
    -d "$DATABASE" \
    --no-owner \
    --no-acl \
    | gzip > "$DUMP_FILE"

echo "Uploading to s3://${DUMP_BUCKET}/${DUMP_KEY}..."
aws s3 cp "$DUMP_FILE" "s3://${DUMP_BUCKET}/${DUMP_KEY}" --region "$DUMP_REGION"

echo "Upload successful"
rm -f "$DUMP_FILE"
echo "Done!"
