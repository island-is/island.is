#!/bin/bash

#########################################
# Script for testing system-e2e locally #
#########################################

set -euo pipefail

. ./scripts/utils.sh

export \
  APP="system-e2e" \
  TEST_ENVIRONMENT="local"

PROG_NAME=$(basename "${0}")
PROJECT_DIR=$(git rev-parse --show-toplevel)
APP_HOME=$(jq ".projects[\"${APP}\"]" -r <"${PROJECT_DIR}"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r <"${PROJECT_DIR}"/"${APP_HOME}"/project.json)
ENV_FILE="${PROJECT_DIR}/.env.secret"

LE2E_ACTION="run"
LE2E_ARGS=()
LE2E_SECRETS=()
LE2E_ENVIRONMENT="local"
LE2E_TEST_TYPE="smoke"
LE2E_HEADEDEDNESS="headless"
LE2E_BROWSER="chrome"
LE2E_RUN_MODE="container"

DOCKERFILE="Dockerfile"
DOCKER_TAG=local-e2e #"$(git rev-parse --short HEAD)"
DOCKER_IMAGE="localhost/${APP}":"${DOCKER_TAG}"
DOCKER_TARGET="output-playwright"
DOCKER_BUILD_ARGS="--build-arg APP=${APP} --build-arg APP_HOME=${APP_HOME} --build-arg APP_DIST_HOME=${APP_DIST_HOME} --build-arg GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) --build-arg GIT_SHA=${DOCKER_TAG}"

# shellcheck disable=SC1091,SC1090
. "${ENV_FILE}"

function _get_builder_name() {
  if command -v podman >/dev/null; then
    echo "podman"
  else
    echo "docker"
  fi
}

function builder() {
  if command -v podman >/dev/null; then
    podman "$@"
  else
    docker "$@"
  fi
}

function image_exists() {
  builder images -q "${1}" 2>/dev/null
  return $?
}
function _ensure_image() {

  if image_exists "${DOCKER_IMAGE}"; then
    warning "${DOCKER_IMAGE} has not been built yet, starting build now ..."
    build_image
    log debug "Successfully built image"
  fi
  return 0
}

function _get_source_path() {
  [ "${LE2E_CODE_SOURCE}" = "source" ] && echo "${APP_HOME}"
  [ "${LE2E_CODE_SOURCE}" = "dist" ] && echo "${APP_DIST_HOME}"
}

function _build_app() {
  yarn nx run ${APP}:build
}

function run_container() {
  debug "run_container START"
  local tmp_dir="${PROJECT_DIR}/tmp"
  local secrets_file="${PROJECT_DIR}/.env.secret"
  local secrets_env_file="${secrets_file}.docker"

  debug "run_container mkdir"
  mkdir -p "${tmp_dir}"

  debug "run_container cp"
  cp "${secrets_file}" "${secrets_env_file}"

  debug "run_container creating .env"
  debug "run_container Secrets file: ${secrets_file}"
  debug "run_container Secrets file (docker): ${secrets_env_file}"
  # transform .env secrets file to actual .env file
  grep -v '^#' "${secrets_file}" | cut -d ' ' -f 2- >"${secrets_env_file}" || true

  if ! image_exists "${DOCKER_IMAGE}"; then
    log warning "Missing image ${DOCKER_IMAGE}"
    log warning "Run $0 build"
    return 1
  fi

  log info "Running $APP in container with args '$*'"
  runner \
    -v "${tmp_dir}":/out:Z \
    --env-file "${secrets_env_file}" \
    "${DOCKER_IMAGE}" "$@"
  # These options are breaking, causing 'playwright not found'
  # TODO: But are still needed, so we don't have to re-build every time 😿
  #  -v "${PROJECT_DIR}/${APP_DIST_HOME}":"/${APP_DIST_HOME}":z \
  #  -v "${PROJECT_DIR}/${APP_HOME}/entrypoint.sh":"/${APP_DIST_HOME}/entrypoint.sh":z \
  return $?

  log info "Checking container pre-requisites"
  log debug "Building app"
  _build_app
  log debug "Making sure the image exists"
  _image_exists
  log info "Running $APP in container"
  log debug "Running $APP in container with args '$*'"
  (
    set -x
    runner \
      -v "${tmp_dir}":/out:Z \
      -v "${PROJECT_DIR}/${APP_DIST_HOME}":"/${APP_DIST_HOME}":Z \
      -v "${PROJECT_DIR}/${APP_HOME}/entrypoint.sh":"/${APP_DIST_HOME}/entrypoint.sh":Z \
      --env-file "${secrets_env_file}" \
      "${DOCKER_IMAGE}" "$@"
  )
}

function build_image() {
  (
    export DOCKER_TAG
    exec ./scripts/ci/_podman.sh "$DOCKERFILE" "$DOCKER_TARGET"
  )
  return 0
}

function runner() {
  if command -v podman >/dev/null; then
    podman run --stop-signal SIGKILL --userns=keep-id "$@"
  else
    docker run "$@"
  fi
}

usage() {
  cat <<EOF
Usage: ${PROG_NAME} <build|run>

build     APP_NAME
run       [--container|--host] [--environment (local, dev, staging)]

EOF
  exit 1
}

function le2e_test() {
  info "Running ${LE2E_TEST_TYPE} tests..."
  podman run --env-file .env.secret --env-file ~/.env.secret --rm -it --name local-e2e -e TEST_ENVIRONMENT="${LE2E_ENVIRONMENT}" --userns=keep-id localhost/system-e2e:local-e2e
  # yarn playwright test -c apps/system-e2e/src "${LE2E_TEST_TYPE}" "${LE2E_ARGS[@]}"
  #playwright test -c apps/system-e2e/src "--${LE2E_HEADEDEDNESS}" "${LE2E_TARGET}" "${LE2E_ARGS[@]}"
}

function cli() {
  # Parse command/action
  local cmd="${1:-help}"
  case "${cmd}" in
  build | test | run) LE2E_ACTION="${cmd}" ;;
  --help | -h | help) usage ;;
  *) LE2E_ACTION="passthrough" ;;
  esac
  shift

  # Parse options
  while [[ $# -gt 0 ]]; do
    local opt="${1:-}"
    local arg="${2:-}"
    local n_args=1
    case "${opt}" in
    --smoke) LE2E_TEST_TYPE="smoke" ;;
    --acceptance) LE2E_TEST_TYPE="acceptance" ;;
    --container) LE2E_RUN_MODE="container" ;;
    --host) LE2E_RUN_MODE="host" ;;
    --environment | -e) LE2E_ENVIRONMENT="${arg}" n_args=2 ;;
    --secrets-file) LE2E_SECRETS+=("${arg}") n_args=2 ;;
    --) LE2E_ARGS=("${@:2}") n_args=$# ;;
    *) LE2E_TARGET="${opt}" LE2E_ARGS=("${@:1}") n_args=$# ;;
    esac
    shift ${n_args}
  done

  echo "ENV:"
  log debug "$(set | grep "^LE2E_*")"

  return
}

function main() {
  cli "$@"
  debug "Running action: ${LE2E_ACTION}"
  debug "     with args: ${LE2E_ARGS[*]}"

  case "${LE2E_ACTION}" in
  build) build_image ;;
  test) le2e_test ;;
  run) run_container "${LE2E_ARGS[@]}" ;;
  *) usage ;;
  esac
}

log info "START main"
main "$@"
log info "DONE"
exit $?
