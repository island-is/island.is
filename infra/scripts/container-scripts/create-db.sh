#!/bin/bash

# This script creates or updates database users with appropriate permissions and passwords in PostgreSQL.
# It also handles read-only and write users based on the naming convention and enables specified Postgres extensions.

set -euo pipefail
shopt -s inherit_errexit

declare \
  DB_NAME \
  DB_USER \
  DB_PASSWORD_KEY \
  DB_EXTENSIONS

function create_or_update_user {
  local user=$1
  local password_key=$2
  local is_read_only=$3

  echo "Configuring user: $user"

  # Attempt to fetch existing password
  set +e # Disable script stopping for this command
  local password
  password=$(node secrets get "$password_key")
  local fetch_status=$?
  set -e # Re-enable script stopping on errors

  local password_generated="false"
  if [[ $fetch_status -ne 0 || -z "$password" ]]; then
    echo "Generating new password for $user."
    # Generate a new password if it doesn't exist in SSM
    set +e
    password=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 27)
    set -e
    password_generated="true"
  else
    echo "Using existing password for $user."
  fi

  # Create or update user with password
  echo "Creating or updating database user."
  psql -c "DO
    \$do\$
      BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles
            WHERE  rolname = '$user') THEN

            CREATE ROLE $user LOGIN ENCRYPTED PASSWORD '$password';
        ELSE
            ALTER ROLE $user WITH ENCRYPTED PASSWORD '$password';
        END IF;
      END
    \$do\$;"

  if [[ "$password_generated" == "true" ]]; then
    echo "Storing new password in AWS SSM."
    # Store the new password in AWS SSM if it was generated
    node secrets store "$password_key" "$password" || {
      echo "Failed to store password for $user in AWS SSM."
      return 1 # Return with error
    }
  fi

  if [[ "$is_read_only" == "true" ]]; then
    # Grant read-only access
    psql -c "GRANT CONNECT ON DATABASE $DB_NAME TO $user"
    psql -c "GRANT USAGE ON SCHEMA public TO $user"
    psql -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO $user"
    psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $user"
    echo "Configured $user with read-only access."
  else
    # Grant full privileges
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $user"
    echo "Configured $user with full access."
  fi
}

PGPASSWORD=$(node secrets get "$PGPASSWORD_KEY")
export PGPASSWORD

echo "Creating database if it doesn't exist."
psql -c "CREATE DATABASE $DB_NAME" || true

# Determine if $DB_USER is a read-only user and adjust DB_PASSWORD_KEY for the write user accordingly
if [[ "$DB_USER" == *"_read" ]]; then
  # The DB_PASSWORD_KEY for the read-only user is correct, so use it as is
  create_or_update_user "$DB_USER" "$DB_PASSWORD_KEY" "true"
  # Remove "readonly/" to create the write user's DB_PASSWORD_KEY
  WRITE_DB_PASSWORD_KEY="${DB_PASSWORD_KEY/readonly\//}"
  WRITE_USER="${DB_USER%_read}"
  create_or_update_user "$WRITE_USER" "$WRITE_DB_PASSWORD_KEY" "false"
else
  # Handle write user only
  create_or_update_user "$DB_USER" "$DB_PASSWORD_KEY" "false"
fi

echo "Checking if Postgres extensions should be installed..."
if [[ -z "$DB_EXTENSIONS" ]]; then
  echo "DB_EXTENSIONS environment variable is empty, nothing to enable."
else
  for extension in ${DB_EXTENSIONS//,/ }; do
    echo "Enabling $extension"
    psql -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"$extension\";"
  done
fi
