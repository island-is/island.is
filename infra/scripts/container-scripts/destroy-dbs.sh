#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

PGPASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD

set -x
FEATURE_NAME=$1


psql -tc "SELECT datname FROM pg_database WHERE datname like 'feature_${FEATURE_NAME}_%'" --field-separator ' ' --no-align --quiet \
| while read -r dbname; do
    psql -c "DROP DATABASE $dbname"
done

psql -tc "SELECT rolname FROM pg_roles WHERE rolname like 'feature_${FEATURE_NAME}_%'" --field-separator ' ' --no-align --quiet \
| while read -r rolname; do
    psql -c "DROP USER $rolname"
done

node secrets delete /k8s/feature-"$FEATURE_NAME"-
