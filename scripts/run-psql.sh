#!/bin/bash

# This script runs psql console or SQL queries as arguments in a container using credentials from envs inside a pod.


set -euo pipefail

RST=$(echo -en '\033[0m')
BLUE=$(echo -en '\033[00;34m')
LBLUE=$(echo -en '\033[01;34m')
RED=$(echo -en '\033[00;31m')
YELLOW=$(echo -en '\033[00;33m')
GREEN=$(echo -en '\033[00;32m')

trap "exit" INT TERM
trap "kill 0" EXIT

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

get_creds() {
  local ns
  local pod
  ns="$1"
  pod="$2"
  kubectl get pods -n "$ns" -o json | \
    jq '.items[] | select(.metadata.name | contains("'"$pod"'"))' | \
    jq -r '.metadata.name' | \
    xargs -I{} \
    kubectl exec --stdin {} -- \
    /bin/sh -c 'printf "$DB_USER $DB_PASS $DB_NAME\n"'
}

run_query() {
  local user="$1"
  local pass="$2"
  local db="$3"
  local query="$4"

  docker run --rm -it --network host \
    -e POSTGRES_USER="$user" \
    -e POSTGRES_PASSWORD="$pass" \
    -e POSTGRES_DB="$db" \
    postgres bash -c "$query"
}

repeat() {
  until "$@" > /dev/null; do echo "${YELLOW}waiting for db-proxy to be ready....${RST}"; sleep 2; done
  echo "${GREEN}db-proxy is ready!${RST}"
}

psql_connect() {
  local user="$1"
  local pass="$2"
  local db="$3"
  local query_raw="$4"
  local console="$5"
  local query='SELECT json_agg(q) from ('"$query_raw"') q;'

  psql='PAGER= PGPASSWORD=$POSTGRES_PASSWORD psql -v ON_ERROR_STOP=1 -h localhost -U $POSTGRES_USER -A $POSTGRES_DB'

  echo "Checking for db-proxy on port 5432..."
  repeat run_query "$1" "$2" "$3" "$psql -c \"select now();\""

  if [ "$console" == false ]; then
    run_query "$1" "$2" "$3" "$psql -t -c \"$query\""
    exit 0
  fi

  run_query "$1" "$2" "$3" "$psql"
}

run_proxy() {
  local CLUSTER_ARG
  CLUSTER_ARG="$1"
  (CLUSTER="$CLUSTER_ARG"-cluster01 "$DIR"/run-db-proxy.sh; echo "Running db-proxy in subshell...") &
}

function usage {
        echo "${BLUE}Usage: $(basename $0) -n -d [-c] [-q | -p] [-l]${RST}" 2>&1
        echo "${LBLUE}Example query: $(basename $0) -l staging -n some-namespace -d some-pod -q \"SELECT field from db\"${LBLUE}" 2>&1
        echo "${LBLUE}Example psql: $(basename $0) -l staging -n some-namespace -d some-pod -p${LBLUE}" 2>&1
        echo '   -c   returns db credentials.'
        echo '   -l   set cluster name [dev,staging,prod], this will run db-proxy in subshell.'
        echo '   -n   cluster namespace.'
        echo '   -q   SQL query, returns json results.'
        echo '   -d   pod name, full or partial string, uses jq contains()'
        echo '   -p   enter psql console.'
        exit 1
}

if [[ ${#} -eq 0 ]]; then
   usage
fi

CLUSTER_NAME=""
NAMESPACE=""
CREDS=false
PSQL=false
QUERY=""
POD=""

while getopts ':cpn:d:l:q:' arg; do
  case "${arg}" in
    p)
      PSQL=true
      ;;
    c)
      CREDS=true
      ;;
    l)
      CLUSTER_NAME="${OPTARG}"
      ;;
    n)
      NAMESPACE="${OPTARG}"
      ;;
    d)
      POD="${OPTARG}"
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

if [ -z "$NAMESPACE" ]; then
  echo "${RED}ERROR: -n [namespace] is required${RST}"
  usage
fi

if [ -z "$POD" ]; then
  echo "${RED}ERROR: -d [pod name] is required${RST}"
  usage
fi

if [ "$PSQL" == true ] && [ -n "$QUERY" ]; then
  echo "${RED}ERROR: -p and -q are mutually exclusive, either run a query or enter psql console.${RST}"
  usage
fi

if [ "$CREDS" == true ]; then
  read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds "$NAMESPACE" "$POD")
  echo "export DB_USER=$POSTGRES_USER DB_PASS=$POSTGRES_PASSWORD DB_NAME=$POSTGRES_DB"
  exit 0
fi

if [ -n "$CLUSTER_NAME" ]; then
  echo "${BLUE}Starting db-proxy${RST}"
  run_proxy "$CLUSTER_NAME" > /dev/null
fi


if [ "$PSQL" == true ]; then
  # run psql console, query is empty
  read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds "$NAMESPACE" "$POD")
  psql_connect "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB" "$QUERY" $PSQL
  exit 0
fi

if [ -z "$QUERY" ]; then
  echo "${RED}ERROR: SQL query is required, e.g. -q \"SELECT field from table\"${RST}"
  usage
fi


read -r POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB <<< $(get_creds "$NAMESPACE" "$POD")

psql_connect \
  "$POSTGRES_USER" \
  "$POSTGRES_PASSWORD" \
  "$POSTGRES_DB" \
  "$QUERY" \
  $PSQL
