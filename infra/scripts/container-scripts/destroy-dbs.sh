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
    psql -c "DROP DATABASE IF EXISTS '$dbname' WITH(FORCE);"
    echo "Dropping database with dbname '$dbname'"
  done

psql -tc "SELECT rolname FROM pg_roles WHERE rolname like 'feature_${FEATURE_DB_NAME}_%'" --field-separator ' ' --no-align --quiet |
  while read -r rolname; do
    psql -c "DROP USER '$rolname' WITH(FORCE);"
    echo "Deleting the rolname '$rolname'"
  done

node secrets delete "/k8s/feature-$FEATURE_NAME"
