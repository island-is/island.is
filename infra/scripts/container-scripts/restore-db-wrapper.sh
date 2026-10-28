#!/bin/bash
set -euo pipefail

# Always create the database, users, and extensions first
echo "Step 1: Creating database and users..."
/app/create-db.sh

# Conditionally restore from S3 dump if restore env vars are present
if [[ -n "${RESTORE_BUCKET:-}" ]] && [[ -n "${RESTORE_KEY:-}" ]]; then

  DUMP_REGION="${DUMP_REGION:-eu-west-1}"
  DUMP_MAX_AGE_SECONDS=86400  # 24h, hard

  needs_dump=false
  last_modified=$(aws s3api head-object \
    --bucket "$RESTORE_BUCKET" \
    --key "$RESTORE_KEY" \
    --region "$DUMP_REGION" \
    --query 'LastModified' --output text 2>/dev/null || echo "")

  if [[ -z "$last_modified" ]]; then
    echo "Dump s3://${RESTORE_BUCKET}/${RESTORE_KEY} not found - will create it."
    needs_dump=true
  else
    last_epoch=$(date -d "$last_modified" +%s 2>/dev/null || echo 0)
    now_epoch=$(date +%s)
    age=$(( now_epoch - last_epoch ))
    if (( last_epoch == 0 || age > DUMP_MAX_AGE_SECONDS )); then
      echo "Dump is stale (age ${age}s > ${DUMP_MAX_AGE_SECONDS}s) - regenerating."
      needs_dump=true
    else
      echo "Dump is fresh (age ${age}s) - reusing existing S3 object."
    fi
  fi

  if [[ "$needs_dump" == "true" ]]; then
    echo "Generating fresh dump from source servicesauth DB..."
    DUMP_DB_PASSWORD="$(node secrets get "$PGPASSWORD_KEY")" \
    DUMP_DB_USER="$PGUSER" \
    DATABASE="servicesauth" \
    SOURCE_DB_HOST="$PGHOST" \
    DUMP_BUCKET="$RESTORE_BUCKET" \
    DUMP_KEY="$RESTORE_KEY" \
    DUMP_REGION="$DUMP_REGION" \
      /app/dump-ids-dev-db.sh
  fi
  # --- end dump freshness check ---

  echo "Step 2b: Restore configuration detected, running restore..."
  /app/restore-db.sh

  #insert redirect uri for the feature so ids admin web will work
  export PGPASSWORD="$(node secrets get "$PGPASSWORD_KEY")"

  FEATURE_NAME="${DB_NAME#feature_}"
  FEATURE_NAME="${FEATURE_NAME%_servicesauth}"
  FEATURE_NAME="${FEATURE_NAME//_/-}"

  echo "Inserting client redirect URI for feature: ${FEATURE_NAME}..."
  export PGPASSWORD="$(node secrets get "$PGPASSWORD_KEY")"

  psql -h "$PGHOST" -U "$PGUSER" -d "$DB_NAME" -c "
    INSERT INTO client_redirect_uri (
      client_id,
      redirect_uri,
      created,
      modified
    ) VALUES (
      '@island.is/auth-admin-web',
      'https://${FEATURE_NAME}.identity-server.dev01.devland.is/admin/api/auth/callback/identity-server',
      NOW(),
      NOW()
    );
  "
else
  echo "Step 2: No restore configuration found (RESTORE_BUCKET not set)"
  echo "Database created empty - migrations will run in service init containers."
fi

echo "Database initialization complete."