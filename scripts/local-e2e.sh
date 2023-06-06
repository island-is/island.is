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
LE2E_ENVIRONMENT="local"
LE2E_TEST_TYPE="smoke"
LE2E_HEADEDEDNESS="headless"
LE2E_BROWSER="chrome"
LE2E_RUN_MODE="container"

DOCKERFILE="${PROJECT_DIR}/scripts/ci/Dockerfile"
DOCKER_TAG="$(git rev-parse --short HEAD)"
DOCKER_IMAGE="localhost/${APP}":"${DOCKER_TAG}"
DOCKER_TARGET="playwright-local"
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

function _image_exists() {
  image=$(builder images -q "${DOCKER_IMAGE}" 2>/dev/null)

  if [ -z "${image}" ]; then
    warning "${DOCKER_IMAGE} has not been built yet, starting build now ..."
    build_image
  fi
}

function _get_source_path() {
  [ "${LE2E_CODE_SOURCE}" = "source" ] && echo "${APP_HOME}"
  [ "${LE2E_CODE_SOURCE}" = "dist" ] && echo "${APP_DIST_HOME}"
}

function _build_app() {
  nx run ${APP}:build
}

function run_container() {
  local tmp_dir="${PROJECT_DIR}/tmp"
  local secrets_file="${PROJECT_DIR}/.env.secret"
  local secrets_env_file="${secrets_file}.docker"

  mkdir -p "${tmp_dir}"

  cp "${secrets_file}" "${secrets_env_file}"

  # transform .env secrets file to actual .env file
  grep -v '^#' "${secrets_file}" | cut -d ' ' -f 2- >"${secrets_env_file}"

  _build_app
  _image_exists
  runner \
    -v "${tmp_dir}":/out:Z \
    -v "${PROJECT_DIR}/${APP_DIST_HOME}":"/${APP_DIST_HOME}":Z \
    -v "${PROJECT_DIR}/${APP_HOME}/entrypoint.sh":"/${APP_DIST_HOME}/entrypoint.sh":Z \
    --env-file "${secrets_env_file}" \
    "${DOCKER_IMAGE}" "$@"
}

# shellcheck disable=SC2086
function build_image() {
  DOCKER_TAG=local-e2e exec ./scripts/ci/_podman.sh Dockerfile playwright-local
  return
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

build     [-a app-name: default system-e2e]
run       -i LE2E_integration -t smoke|acceptance -c <source|dist|container>
          [-e <local|dev|staging|prod>, default: local]
          [-b LE2E_browser, default: chrome] [-l, default: headless]
          [-d, extremely verbose cypress debugging]

examples
         ${PROG_NAME} run -i air-discount-scheme -t acceptance -c source -l
         ${PROG_NAME} run -i skilavottord -t acceptance -c container -b electron
         ${PROG_NAME} run -i web -t smoke -c dist -b firefox -l
EOF
  exit 1
}

function le2e_test() {
  info "Running ${LE2E_TEST_TYPE} tests..."
  podman run --rm -it --name local-e2e -e TEST_ENVIRONMENT="${LE2E_ENVIRONMENT}" --userns=keep-id --entrypoint bash localhost/system-e2e:local-e2e
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
