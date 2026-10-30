#!/bin/bash
set -euo pipefail

#DB_NAME=feature_featgenerate_ids_feature_values_servicesauth
#DB_USER=feature_featgenerate_ids_feature_values_servicesauth
#PGUSER=root
#PGPASSWORD_KEY=/rds/vidspyrna/masterpassword


# Get DB password from SSM
DB_MASTER_PASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD="$DB_MASTER_PASSWORD"

# Check if database already has tables (skip if restored)
echo "Checking if database has existing tables..."
TABLE_COUNT=$(psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -t -c \
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
gunzip -c "$DUMP_FILE" | psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -v ON_ERROR_STOP=0

# The dump is restored as the master user ($PGUSER), which leaves restored
# objects owned by that user and prevents the feature DB owner ($DB_USER)
# from running migrations. We fix that here.

psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "ALTER SCHEMA public OWNER TO \"$DB_USER\""
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "GRANT USAGE, CREATE ON SCHEMA public TO \"$DB_USER\""

# Reassign ownership of tables, sequences and views in public to the feature role (scoped, per-object).
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -t -A -c \
  "SELECT 'ALTER TABLE public.\"' || tablename || '\" OWNER TO \"$DB_USER\";' FROM pg_tables WHERE schemaname = 'public'" \
  | psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -t -A -c \
  "SELECT 'ALTER SEQUENCE public.\"' || sequencename || '\" OWNER TO \"$DB_USER\";' FROM pg_sequences WHERE schemaname = 'public'" \
  | psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -t -A -c \
  "SELECT 'ALTER VIEW public.\"' || viewname || '\" OWNER TO \"$DB_USER\";' FROM pg_views WHERE schemaname = 'public'" \
  | psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -v ON_ERROR_STOP=1

psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"$DB_USER\""
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"$DB_USER\""
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES FOR ROLE \"$DB_USER\" IN SCHEMA public GRANT ALL ON TABLES TO \"$DB_USER\""
psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES FOR ROLE \"$DB_USER\" IN SCHEMA public GRANT ALL ON SEQUENCES TO \"$DB_USER\""


# Verify
TABLE_COUNT_AFTER=$(psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -t -c \
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
