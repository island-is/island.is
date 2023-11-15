#!/bin/bash

set -euo pipefail

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

parse_cli() {
  while [ $# -gt 0 ]; do
    local arg="$1"
    local opt="${2:-}"
    case $arg in
    -f | --remove-containers | --force)
      REMOVE_CONTAINERS_ON_START=true
      REMOVE_CONTAINERS_ON_FAIL=true
      REMOVE_CONTAINERS_FORCE=true
      ;;
    -s | --remove-containers-on-start)
      REMOVE_CONTAINERS_ON_START=true
      ;;
    -x | --remove-containers-on-fail)
      REMOVE_CONTAINERS_ON_FAIL=true
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
      ARGS+=("$1")
      ;;
    esac
    shift
  done
}

parse_cli "$@"

main() {
  for proxy in es soffia xroad redis db; do
    local container_name
    container_name="$(grep -oP '(?<=--service )\S+' ./scripts/run-$proxy-proxy.sh)"
    if [ "$proxy" == "es" ]; then container_name="es-proxy"; fi
    if [ -n "${REMOVE_CONTAINERS_ON_START:-}" ] && containerer ps -a | grep -q "$container_name"; then
      echo "Removing containers..."
      containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
    fi
    echo "Starting $proxy proxy"
    (
      while true; do
        code=0
        ./scripts/run-$proxy-proxy.sh "${ARGS[@]}" || code=$?
        echo "Exit code for $proxy proxy: $code"
        if [ $code -eq 1 ]; then exit 1; fi
        echo "Restarting $proxy proxy in $RESTART_INTERVAL_TIME seconds..."
        sleep "$RESTART_INTERVAL_TIME"
        if [ -n "${REMOVE_CONTAINERS_ON_FAIL:-}" ]; then
          echo "Removing container $container_name..."
          containerer rm ${REMOVE_CONTAINERS_FORCE:+-f} "$container_name"
        fi
      done
    ) &
  done
  wait
}
main
