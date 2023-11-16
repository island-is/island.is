#!/bin/bash

set -euo pipefail
# set -x

: "${REMOVE_CONTAINERS_ON_START:=}"
: "${REMOVE_CONTAINERS_ON_FAIL:=}"
: "${REMOVE_CONTAINERS_FORCE:=}"
: "${RESTART_INTERVAL_TIME:=3}"

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
  $builder_cmd "$@"
}

ARGS=()
PROXIES=()

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
    echo "DEBUG: arg=$arg opt=$opt value=$value negative=$negative"

    case $arg in
    -f | --remove-containers | --force)
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
  if [ ${#PROXIES} -eq 0 ]; then return; fi
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

parse_cli "$@"

main() {
  for proxy in "${PROXIES[@]}"; do
    if [ -z "$proxy" ]; then continue; fi
    local container_name
    container_name="$(grep -oP '(?<=--service )\S+' "./scripts/run-$proxy-proxy.sh")"
    if [ "$proxy" == "es" ]; then container_name="es-proxy"; fi
    if [ -n "${REMOVE_CONTAINERS_ON_START:-}" ] && containerer ps -a | grep -q "$container_name"; then
      echo "Removing containers on start..."
      containerer stop ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
      containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
    fi
    echo "Starting $proxy proxy"
    (
      while true; do
        code=0
        "./scripts/run-$proxy-proxy.sh" "${ARGS[@]}" || code=$?
        echo "Exit code for $proxy proxy: $code"
        if [ $code -eq 1 ]; then exit 1; fi
        echo "Restarting $proxy proxy in $RESTART_INTERVAL_TIME seconds..."
        sleep "$RESTART_INTERVAL_TIME"
        if [ -n "${REMOVE_CONTAINERS_ON_FAIL:-}" ]; then
          echo "Removing container $container_name on fail..."
          containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
        fi
      done
    ) &
  done
  wait
}
main
