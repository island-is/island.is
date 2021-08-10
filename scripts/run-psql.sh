#!/bin/bash

# This script runs psql in a container using credentials from envs inside a pod.
# It attaches to he active k8s namespace in your shell.

# WARNING: The script attaches to the first listed pod in the namespace which might not be what you want.

set -euo pipefail

trap "exit" INT TERM
trap "kill 0" EXIT

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

get_creds() {
  kubectl get pods -o=jsonpath='{.items[0]..metadata.name}' | \
      xargs -I{} \
      kubectl exec --stdin {} -- \
      /bin/sh -c 'printf "$DB_USER $DB_PASS $DB_NAME\n"'
}

run_query() {
  docker run --rm -it --network host \
    -e POSTGRES_USER="$1" \
    -e POSTGRES_PASSWORD="$2" \
    -e POSTGRES_DB="$3" \
    postgres bash -c 'PGPASSWORD=$POSTGRES_PASSWORD psql -v ON_ERROR_STOP=1 -h localhost -U $POSTGRES_USER -A $POSTGRES_DB '"$4"' -t'
}

repeat() { while :; do "$@" > /dev/null && return; sleep 2; echo "still waiting...."; done }

psql_connect() {
  local QUERY_ARG="$4"
  local CONSOLE="$5"
  local QUERY_CMD='-c "SELECT json_agg(q) from ('"$QUERY_ARG"') q;"'

  if [ "$CONSOLE" == true ]; then
    QUERY_CMD=
  fi
  echo "Waiting for db-proxy to be ready on port 5432..."
  repeat run_query "$1" "$2" "$3" "-c 'select now()'"

  run_query "$1" "$2" "$3" "$QUERY_CMD"

}

run_proxy() {
  local CLUSTER_ARG
  CLUSTER_ARG=$1
  (CLUSTER="$CLUSTER_ARG"-cluster01 "$DIR"/run-db-proxy.sh; echo "Running db-proxy in subshell...") &
}

function usage {
        echo "Usage: $(basename $0) [-anq]" 2>&1
        echo '   -c   returns db credentials.'
        echo '   -n   set cluster name [dev,staging,prod], this will run db-proxy in subshell.'
        echo '   -q   SQL query, returns json results.'
        echo '   -p   enter psql console.'
        exit 1
}

if [[ ${#} -eq 0 ]]; then
   usage
fi
CLUSTER_NAME=""
CREDS=false
PSQL=false
QUERY=""

while getopts ':cpn:q:' arg; do
  case "${arg}" in
    p)
      PSQL=true
      ;;
    c)
      CREDS=true
      ;;
    n)
      CLUSTER_NAME="${OPTARG}"
      ;;
    q)
      QUERY="${OPTARG}"
      ;;
    ?)
      echo "Invalid option: -${OPTARG}."
      echo
      usage
      ;;
  esac
done

if [ "$CREDS" == true ]; then
  read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds)
  echo "export DB_USER=$POSTGRES_USER DB_PASS=$POSTGRES_PASSWORD DB_NAME=$POSTGRES_DB"
  exit 0
fi

if [ -n "$CLUSTER_NAME" ]; then
  run_proxy "$CLUSTER_NAME"
fi

if [ "$PSQL" == true ]; then
  # run psql console, query is empty
  read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds)
  psql_connect "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB" "$QUERY" $PSQL
  exit 0
fi

if [ -z "$QUERY" ]; then
  echo "ERROR: SQL query is required, e.g. -q \"SELECT field from table\""
  exit 1
fi

read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds)
psql_connect "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB" "$QUERY" $PSQL
echo "done!"