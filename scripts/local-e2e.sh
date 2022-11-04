#!/bin/bash

#########################################
# Script for testing system-e2e locally #
#########################################

set -euo pipefail


RED=$(echo -en '\033[00;31m')
GREEN=$(echo -en '\033[00;32m')
YELLOW=$(echo -en '\033[00;33m')
LBLUE=$(echo -en '\033[01;34m')
RESET=$(echo -en '\033[0m')


export \
  APP="system-e2e" \
  TEST_ENVIRONMENT="local"

PROJECT_DIR=$(git rev-parse --show-toplevel)
APP_HOME=$(jq ".projects[\"$APP\"]" -r < "$PROJECT_DIR"/workspace.json)
APP_DIST_HOME=$(jq ".targets.build.options.outputPath" -r < "$PROJECT_DIR"/"$APP_HOME"/project.json)
CYPRESS_BIN="$PROJECT_DIR/node_modules/.bin/cypress"
ENV_FILE="$PROJECT_DIR/.env.secret"

# shellcheck disable=SC1091,SC1090
source "$ENV_FILE"

DOCKERFILE="${PROJECT_DIR}/scripts/ci/Dockerfile"
DOCKER_TAG="$(git rev-parse --short HEAD)"
DOCKER_IMAGE="localhost/${APP}":"${DOCKER_TAG}"
DOCKER_TARGET="output-local"
DOCKER_BUILD_ARGS="--build-arg APP=${APP} --build-arg APP_HOME=${APP_HOME} --build-arg APP_DIST_HOME=${APP_DIST_HOME} --build-arg GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) --build-arg GIT_SHA=${DOCKER_TAG}"

function info() {
  local msg
  msg="$1"
  echo "${LBLUE}[info]: ${msg}${RESET}"
}

function success() {
  local msg
  msg="$1"
  echo "${GREEN}[success]: ${msg}${RESET}"
}

function error() {
  local msg
  msg="$1"
  echo "${RED}[error]: ${msg}${RESET}"
}

function warning() {
  local msg
  msg="$1"
  echo "${YELLOW}[warn]: ${msg}${RESET}"
}

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
  image=$(builder images -q "${DOCKER_IMAGE}" 2> /dev/null)

  if [ -z "${image}" ]; then
    warning "${DOCKER_IMAGE} has not been built yet, starting build now ..."
    build_image
  fi
}

function _get_source_path() {
  [ "${CODE_SOURCE}" = "source" ] && echo "${APP_HOME}"
  [ "${CODE_SOURCE}" = "dist" ] && echo "${APP_DIST_HOME}"
}

function _build_app() {
  yarn nx run ${APP}:build
}

function open_menu() {
  "${CYPRESS_BIN}" open -P "$@"
}

function run_container() {
  TMP_DIR="${PROJECT_DIR}/tmp"
  SECRETS_FILE="${PROJECT_DIR}/.env.secret"
  SECRETS_ENV_FILE="${SECRETS_FILE}.docker"

  mkdir -p "${TMP_DIR}"

  cp "${SECRETS_FILE}" "${SECRETS_ENV_FILE}"

  # transform .env secrets file to actual .env file
  grep -v '^#' "${SECRETS_FILE}" | cut -d ' ' -f 2- > "${SECRETS_ENV_FILE}" || info "secrets file is empty"
  if [ -z "${TEST_ENVIRONMENT}" ] && ! grep -q '^TEST_ENVIRONMENT' "${SECRETS_ENV_FILE}"; then
    echo "TEST_ENVIRONMENT=local" >> "${SECRETS_ENV_FILE}"
    info "Setting default TEST_ENVIRONMENT to local"
  else
    echo "TEST_ENVIRONMENT=${TEST_ENVIRONMENT}" >> "${SECRETS_ENV_FILE}"
    info "Setting overridden TEST_ENVIRONMENT=${TEST_ENVIRONMENT}"
  fi
  info "Found TEST_ENVIRONMENT in .env.secrets: $(grep TEST_ENVIRONMENT ${SECRETS_ENV_FILE} | tail -n 1)"

  _build_app
  _image_exists
  runner \
    --rm \
    --name playwright-e2e-"${INTEGRATION:-test}" \
    -v "${TMP_DIR}":/out:Z \
    -v "${PROJECT_DIR}/${APP_DIST_HOME}":"/${APP_DIST_HOME}":Z \
    -v "${PROJECT_DIR}/${APP_HOME}/entrypoint.sh":"/${APP_DIST_HOME}/entrypoint.sh":Z \
    --env-file "${SECRETS_ENV_FILE}" \
    "${DOCKER_IMAGE}" "$@"
  exit 0
}

# shellcheck disable=SC2086
function build_image() {
  builder build \
    -f "${DOCKERFILE}" \
    --target="${DOCKER_TARGET}" \
    "${PUBLISH_TO_REGISTRY[@]}" \
    ${DOCKER_BUILD_ARGS:-} \
    ${EXTRA_DOCKER_BUILD_ARGS:-} \
    -t "${DOCKER_IMAGE}" \
    "$PROJECT_DIR"
}

function runner() {
  if command -v podman >/dev/null; then
    podman run --stop-signal SIGKILL --userns=keep-id "$@"
  else
      docker run "$@"
  fi
}

usage() {
  echo
  echo "Usage: $(basename "$0") <build|menu|run>" 2>&1
  echo
  echo "menu          opens up Cypress interactive spec dashboard " 2>&1
  echo "build         [-a app-name: default system-e2e]" 2>&1
  echo "run           -i integration -t smoke|acceptance -c <source|dist|container> [-e <local|dev|staging|prod>, default: local] [-b browser, default: chrome] [-l, default: headless] [-d, extremely verbose cypress debugging]" 2>&1
  echo
  echo "examples " 2>&1
  echo "         $(basename "$0") run -i air-discount-scheme -t acceptance -c source -l" 2>&1
  echo "         $(basename "$0") run -i skilavottord -t acceptance -c container -b electron" 2>&1
  echo "         $(basename "$0") run -i web -t smoke -c dist -b firefox -l" 2>&1
  exit 1
}

CODE_SOURCE=""
INTEGRATION=""
TEST_TYPE=""
HEAD="--headless"
BROWSER="chrome"

if [ ! 0 == $# ]; then
  case "$1" in
    build)
      shift
      while getopts ":a:" opt; do
        case "${opt}" in
          a)
            export APP=${OPTARG}
            ;;
          :)
            error "-${OPTARG} requires an argument."
            ;;
          \?)
            usage
            ;;
        esac
      done
      build_image && exit 0
      ;;
    menu)
      shift
      open_menu "${APP_HOME}" && exit 0
      ;;
    run)
      shift
      while getopts ":i:c:t:b:e:ld" opt; do
        case "${opt}" in
          i)
            INTEGRATION=${OPTARG}
            ;;
          c)
            [ "${OPTARG}" != "dist" ] && [ "${OPTARG}" != "source" ] && [ "${OPTARG}" != "container" ] && usage
            CODE_SOURCE=${OPTARG}
            ;;
          t)
            TEST_TYPE=${OPTARG}
            ;;
          b)
            BROWSER=${OPTARG}
            ;;
          d)
            export DEBUG="cypress:*"
            ;;
          l)
            HEAD="--headed"
            ;;
          e)
            [ "${OPTARG}" != "local" ] && [ "${OPTARG}" != "dev" ] && [ "${OPTARG}" != "staging" ] && [ "${OPTARG}" != "prod" ] && usage
            export TEST_ENVIRONMENT=${OPTARG}
            ;;
          :)
            error "-${OPTARG} requires an argument."
            ;;
          \?)
            usage
            ;;
        esac
      done
      ;;
    *)
      usage
      ;;
  esac
else
  usage
fi

# run dist in container
[ "$CODE_SOURCE" = "container" ] && run_container -s "**/${INTEGRATION}/${TEST_TYPE}/*.spec.{ts,js}" --headless

# run either from source or dist
"${CYPRESS_BIN}" run -P "$(_get_source_path "${CODE_SOURCE}")" -s "**/integration/${INTEGRATION}/${TEST_TYPE}/*.spec.{ts,js}" --browser "${BROWSER}" ${HEAD} && exit 0
