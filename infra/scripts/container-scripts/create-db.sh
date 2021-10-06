#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

PGPASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD

psql -c "CREATE DATABASE $DB_NAME" || true

set +e
DB_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 27)
set -e

psql -c "create user $DB_USER with encrypted password '$DB_PASSWORD'" || true

if node secrets store "$DB_PASSWORD_KEY" "$DB_PASSWORD"; then
    psql -c "alter user $DB_USER with password '$DB_PASSWORD'"
fi

# idempotent
psql -c "grant all privileges on database $DB_NAME to $DB_USER"