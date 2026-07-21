#!/bin/bash
set -euo pipefail

# Always create the database, users, and extensions first
echo "Step 1: Creating database and users..."
/app/create-db.sh

# Conditionally restore from S3 dump if restore env vars are present
if [[ -n "${RESTORE_BUCKET:-}" ]] && [[ -n "${RESTORE_KEY:-}" ]]; then
  echo "Step 2: Restore configuration detected, running restore..."
  /app/restore-db.sh
else
  echo "Step 2: No restore configuration found (RESTORE_BUCKET not set)"
  echo "Database created empty - migrations will run in service init containers."
fi

echo "Database initialization complete."