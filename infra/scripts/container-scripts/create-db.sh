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

echo "checking if postgres extensions should be installed ..."
if [[ -z $DB_EXTENSIONS ]]; then
    echo "DB_EXTENSIONS env var is empty, nothing to enable."
else
    for i in ${DB_EXTENSIONS//,/ }
    do
        echo "enabling $i"
        psql -d "$DB_NAME" -c 'CREATE extension IF NOT EXISTS '"\"$i\""'';
        if [ "$?" -lt 1 ];
        then
            echo "extension $i enabled"
        else
            echo "Failed to enable extension $i"
        fi
    done
fi

