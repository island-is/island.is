#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

PGPASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD

set -x
FEATURE_NAME=$1
FEATURE_DB_NAME=$(echo "$FEATURE_NAME" | tr -d '\-_')

echo "feature name is $FEATURE_NAME"

psql -tc "SELECT datname FROM pg_database WHERE datname like 'feature_${FEATURE_DB_NAME}_%'" --field-separator ' ' --no-align --quiet |
  while read -r dbname; do
    echo "Dropping database with dbname ${dbname}"
    dropdb --if-exists -f "${dbname}"
  done

psql -tc "SELECT rolname FROM pg_roles WHERE rolname like 'feature_${FEATURE_DB_NAME}_%'" --field-separator ' ' --no-align --quiet |
  while read -r rolname; do
    echo "Dropping role with name ${rolname}"

    if [[ "$rolname" == *read ]]; then
      psql -c "REVOKE USAGE ON SCHEMA PUBLIC FROM ${rolname}"
      psql -c "REVOKE SELECT ON ALL TABLES IN SCHEMA PUBLIC FROM ${rolname}"
      psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM ${rolname}" || true
    fi

    psql -c "DROP ROLE IF EXISTS ${rolname};" || true
  done

node secrets delete "/k8s/feature-$FEATURE_NAME"
