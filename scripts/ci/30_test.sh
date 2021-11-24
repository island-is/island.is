#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

APP_HOME=$(jq ".projects[\"$APP\"].root" -r < "$PROJECT_ROOT"/workspace.json)

if [ -f "$PROJECT_ROOT"/"$APP_HOME"/sequelize.config.js ]; then
  CONTAINER_NAME="test-$APP"

  # Cleanup after the test
  clean_up () {
    docker stop "$CONTAINER_NAME"
    if [ "$1" != "0" ]; then
      echo "Cleanup result for $APP is $? and exit code is $1"
      exit "$1"
    fi
  }
  trap 'clean_up $? $LINENO' EXIT

  # Running postgres
  docker run \
    --rm \
    --detach \
    --publish 5432 \
    --name "$CONTAINER_NAME" \
    --env POSTGRES_DB=test_db \
    --env POSTGRES_USER=test_db \
    --env POSTGRES_PASSWORD=test_db \
    "public.ecr.aws/bitnami/postgresql:11.12.0"

  # Get the random host port from the docker container
  DB_PORT=$(docker inspect -f '{{range $p, $conf := .NetworkSettings.Ports}}{{(index $conf 0).HostPort}}{{end}}' "$CONTAINER_NAME")

  # Wait for postgres to come up and run the tests
  DB_HOST="localhost:$DB_PORT"
  DB_PORT="$DB_PORT" "$DIR"/_wait-for.sh "$DB_HOST" -t 60 -- yarn test "$APP" --runInBand --codeCoverage
else
  # Standalone execution of tests when no external dependencies are needed (DBs, queues, etc.)
  exec yarn run \
    test "${APP}" --runInBand --codeCoverage
fi
