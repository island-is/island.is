#!/bin/bash
set -euo pipefail

# Always create the database, users, and extensions first
echo "Step 1: Creating database and users..."
/app/create-db.sh

# Conditionally restore from S3 dump if restore env vars are present
if [[ -n "${RESTORE_BUCKET:-}" ]] && [[ -n "${RESTORE_KEY:-}" ]]; then
  echo "Step 2: Restore configuration detected, running restore..."
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