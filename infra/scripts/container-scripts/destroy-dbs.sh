#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

declare \
  DB_NAME \
  DB_USER

PGPASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD

set -x
FEATURE_NAME=$1
echo "Dropping databases and roles for feature: $FEATURE_NAME"

echo "Dropping database with dbname ${DB_NAME}"
dropdb --if-exists -f "${DB_NAME}"

echo "Dropping role with name ${DB_USER}"

# Determine if $DB_USER is a read-only user and revoke its privileges
if [[ "$DB_USER" == *"_read" ]]; then

  # We also need to double check if the role exists before trying to revoke privileges
  READ_ONLY_USER_EXISTS=$(psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'")
  if [[ "$READ_ONLY_USER_EXISTS" == "1" ]]; then
    echo "Revoking privileges for read-only user ${DB_USER}"
    psql -c "REVOKE USAGE ON SCHEMA PUBLIC FROM ${DB_USER}"
    psql -c "REVOKE SELECT ON ALL TABLES IN SCHEMA PUBLIC FROM ${DB_USER}"
    psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM ${DB_USER}" || true

  else
    echo "Read-only user ${DB_USER} does not exist, skipping privilege revocation"
    exit 0
  fi
fi

psql -c "DROP ROLE IF EXISTS ${DB_USER};" || true
