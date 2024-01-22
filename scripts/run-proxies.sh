#!/bin/bash

set -euo pipefail
if [[ -n "${DEBUG:-}" || -n "${CI:-}" ]]; then set -x; fi

: "${REMOVE_CONTAINERS_ON_START:=}"
: "${REMOVE_CONTAINERS_ON_FAIL:=}"
: "${REMOVE_CONTAINERS_FORCE:=}"
: "${RESTART_INTERVAL_TIME:=1}"
: "${RESTART_MAX_RETRIES:=3}"
: "${DRY:=}"

ARGS=()
PROXIES=()
PROXY_PIDS=()

trap cleanup SIGINT

cleanup() {
  echo "Cleaning up..."
  # Terminate all background processes (proxy restarts)
  kill "${PROXY_PIDS[@]}" 2>/dev/null || true
  wait "${PROXY_PIDS[@]}"
  exit 0
}

cmd() {
  if [ -z "${DRY:-}" ]; then
    "$@"
    return $?
  fi
  if [[ -n "${DEBUG:-}" ]]; then
    echo "DRY:" "$*"
  fi
}

containerer() {
  local builder_cmd
  if command -v podman >/dev/null 2>&1; then
    builder_cmd="podman"
  elif command -v docker >/dev/null 2>&1; then
    builder_cmd="docker"
  else
    echo "Please install podman or docker"
    exit 1
  fi
  cmd $builder_cmd "$@"
}

parse_cli() {
  while [ $# -gt 0 ]; do
    local arg="$1"
    local opt="${2:-}"
    local value=true

    # Remove any --no- prefix and set the value to false
    local negative=false
    if [[ "$arg" =~ ^--no- ]]; then
      negative=true
      arg="--${arg#--no-}"
    fi
    local value
    if [ "$negative" = true ]; then
      value=false
    else
      value=true
    fi
    # echo "DEBUG: arg=$arg opt=$opt value=$value negative=$negative"
    case $arg in
    -f | --remove-containers | --force | --replace)
      REMOVE_CONTAINERS_ON_START="$value"
      REMOVE_CONTAINERS_ON_FAIL="$value"
      REMOVE_CONTAINERS_FORCE="$value"
      ;;
    -s | --remove-containers-on-start)
      REMOVE_CONTAINERS_ON_START="$value"
      ;;
    -x | --remove-containers-on-fail)
      REMOVE_CONTAINERS_ON_FAIL="$value"
      ;;
    -i | --interval)
      RESTART_INTERVAL_TIME="${opt}"
      shift
      ;;
    --)
      shift
      ARGS+=("$@")
      break
      ;;
    *)
      PROXIES+=("$arg")
      ;;
    esac
    shift
  done
  # echo "DEBUG: PROXIES=${PROXIES[*]}"
  # echo "DEBUG: ARGS=${ARGS[*]}"
  # echo "DEBUG: REMOVE_CONTAINERS_ON_START=${REMOVE_CONTAINERS_ON_START}"
  # echo "DEBUG: REMOVE_CONTAINERS_ON_FAIL=${REMOVE_CONTAINERS_ON_FAIL}"
  # echo "DEBUG: REMOVE_CONTAINERS_FORCE=${REMOVE_CONTAINERS_FORCE}"

  # Return early if no proxies
  if [ "${#PROXIES[@]}" -eq 0 ]; then
    PROXIES=("es" "soffia" "xroad" "redis" "db")
    return
  fi

  local unknown_proxies
  unknown_proxies=()
  for proxy in "${PROXIES[@]}"; do
    if ! [[ "$proxy" =~ ^(es|soffia|xroad|redis|db)$ ]]; then
      unknown_proxies+=("$proxy")
    fi
  done
  # Exit with error if there are unknown proxies
  if [[ "${unknown_proxies[*]}" != "" ]]; then
    echo "Unknown proxies: '${unknown_proxies[*]}'"
    exit 1
  fi
}

run-proxy() {
  local service_port="${1}"
  local host_port="${2}"
  local service_name="${3}"
  local service
  local namespace
  local DIR
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
  shift 3

  case "${service_name}" in
  "es")
    service="es-proxy"
    namespace="es-proxy"
    ;;
  "soffia")
    service="socat-soffia"
    namespace="socat"
    ;;
  "xroad")
    service="socat-xroad"
    namespace="socat"
    ;;
  "redis")
    service="socat-redis"
    namespace="socat"
    ;;
  "db")
    service="socat-db"
    namespace="socat"
    ;;
  *)
    echo "Unknown service: ${service_name}"
    exit 1
    ;;
  esac

  cmd "$DIR"/_run-aws-eks-commands.js proxy \
    --namespace "${namespace}" \
    --service "${service}" \
    --port "${service_port}" \
    --proxy-port "${host_port}" \
    --cluster "${CLUSTER:-dev-cluster01}"
}
run-db-proxy() {
  run-proxy 5432 5432 db
}
run-redis-proxy() {
  run-proxy 6379 6379 redis
}
run-es-proxy() {
  run-proxy 9200 9200 es "$@"
}
run-soffia-proxy() {
  run-proxy 443 8443 soffia
}
run-xroad-proxy() {
  run-proxy 80 8081 xroad
}

parse_cli "$@"

loop_proxy() {
  local proxy="${1}"
  local container_name="socat-$proxy"
  [ "$proxy" == "es" ] && container_name="es-proxy"

  while true; do
    run-"${proxy}"-proxy "${ARGS[@]}" || echo "Exit code for $proxy proxy: $?"
    if [ -n "${REMOVE_CONTAINERS_ON_FAIL:-}" ]; then
      echo "Removing container $container_name on fail..."
      containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
    fi
    echo "Restarting $proxy proxy in $RESTART_INTERVAL_TIME seconds..."
    sleep "$RESTART_INTERVAL_TIME"
  done
}

main() {
  PROXY_PIDS=()
  for proxy in "${PROXIES[@]}"; do
    if [ -z "$proxy" ]; then continue; fi
    local container_name="socat-$proxy"
    [ "$proxy" == "es" ] && container_name="es-proxy"

    if [ -n "${REMOVE_CONTAINERS_ON_START:-}" ]; then
      echo "Removing container for '$proxy' on start..."
      containerer stop "$container_name" 2>/dev/null || true
      containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name" || echo "Failed to remove $container_name"
    fi

    echo "Starting $proxy proxy"
    (
      for ((i = 1; i <= RESTART_MAX_RETRIES; i++)); do
        run-"${proxy}"-proxy "${ARGS[@]}" || echo "Exit code for $proxy proxy: $?"
        if [ -n "${REMOVE_CONTAINERS_ON_FAIL:-}" ]; then
          echo "Removing container $container_name on fail..."
          containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
        fi
        echo "Restarting $proxy proxy in $RESTART_INTERVAL_TIME seconds..."
        sleep "$RESTART_INTERVAL_TIME"
      done
    ) &
    PROXY_PIDS+=("$!")
  done
  wait
}

main
