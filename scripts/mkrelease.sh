#!/bin/bash

set -euo pipefail

: "${RELEASE_ID:=32.1.0}"
: "${RELEASE_URL:="https://${RELEASE_ID//\./}-beta.dev01.devland.is"}"
: "${RELEASE_SLEEP_TIME:=10}"
: "${RELEASE_BRANCH:=pre-release/${RELEASE_ID}}"

: "${RELEASE_GITHUB_ORGANIZATION:=island-is}"

# Don't use `realpath` for path resolution, since it isn't portable (MacOS)
: "${RELEASE_ISLANDIS_REPO_PATH:=$(cd ../island.is && pwd)}"
: "${RELEASE_HELM_REPO_PATH:=$(cd ../helm && pwd)}"
: "${RELEASE_IDS_REPO_PATH:=$(cd ../identity-server.web && pwd)}"

: "${RELEASE_ISLANDIS_NAME:="island.is"}"
: "${RELEASE_HELM_NAME:="helm"}"
: "${RELEASE_IDS_NAME:="identity-server.web"}"

: "${DRY:=${RELEASE_DRY:-false}}"

: "${RELEASE_DD_DASHBOARD_URL:=https://app.datadoghq.eu/dashboard/fzx-xqc-dg7/errors-by-service-dasbboard}"
: "${RELEASE_SPINNAKER_BASE_URL:=https://spinnaker.shared.devland.is/#}"
: "${RELEASE_ISLANDIS_SPINNAKER_URL:=${RELEASE_SPINNAKER_BASE_URL}/islandis/executions}"
: "${RELEASE_IDS_SPINNAKER_URL:=${RELEASE_SPINNAKER_BASE_URL}/identity-server/executions}"

COLOR_RED="\e[31m"
COLOR_RESET="\e[0m"
COLOR_BLUE="\e[34m"
COLOR_GRAY="\e[90m"

red() { echo "${COLOR_RED}${*}${COLOR_RESET}"; }
blue() { echo "${COLOR_BLUE}${*}${COLOR_RESET}"; }
gray() { echo "${COLOR_GRAY}${*}${COLOR_RESET}"; }

echo -e "$(gray "$(echo -e "Environment debug:\n###\n$(set | grep '^RELEASE_')\n###")")\n"

run() {
  local CMD EXIT_CODE DEFAULT_VALUE
  if [[ "${1}" =~ (--default|--default=*) ]]; then
    if [[ "${1}" == --default ]]; then shift; fi
    DEFAULT_VALUE="${1#*=}"
    shift
  fi
  CMD=("${@:1}")
  if [[ "${DRY}" == true ]]; then
    CMD=("echo" "DRY:" "${CMD[@]}")
    "${CMD[@]}" >&2
    echo -ne "${DEFAULT_VALUE}${DEFAULT_VALUE:+\n}"
    return
  fi
  # echo -e "$(gray "$(echo -e "[CMD] Command: ${CMD[1]}")")"
  # for arg in "${CMD[@]}"; do
  #   echo -e "$(gray "$(echo -e "[CMD] -> Argument: '${arg}'")")"
  # done

  EXIT_CODE=0
  OUTPUT="$("${CMD[@]}" 2>&1)" || EXIT_CODE=$? || true
  if [ "${EXIT_CODE}" -ne 0 ]; then
    echo -e "Running command failed (exit-code ${EXIT_CODE})! Command:\n'${CMD[*]}'" >&2
    echo -e "Command output:\n${OUTPUT}" >&2
    return "${EXIT_CODE}"
  fi
  echo -e "$(gray "$(echo -e "[CMD] Successfully executed: ${CMD[*]}")")"
}

continue-approved() {
  local MSG="$*"
  echo -e "${MSG}"
  echo -n "Continue? [y/N] "
  if read -r ANSWER; then
    if [[ "${ANSWER}" =~ ^([yY]|yes)$ ]]; then
      return 0
    fi
  fi
  echo ""
  return 1
}

get-actions-url() {
  local REPO_NAME ACTIONS_URL WORKFLOW_URL
  REPO_NAME="${1}"
  ACTIONS_URL="https://github.com/${RELEASE_GITHUB_ORGANIZATION}/${REPO_NAME}/actions"
  WORKFLOW_URL="${ACTIONS_URL}?query=branch:${RELEASE_BRANCH}"
  echo "${WORKFLOW_URL}"
}

create-pre-release() {
  local REPO_NAME="${1}" BRANCH_NAME="${2:-${RELEASE_BRANCH}}" REPO_PATH COMMIT_HASH
  REPO_PATH="$(cd "../${REPO_NAME}" && pwd)"
  echo "Creating ${BRANCH_NAME} on git repository '${REPO_PATH}'"
  (
    cd "${REPO_PATH}"
    COMMIT_HASH="$(run --default="fake0hash9" git log origin/main -n 1 --format=format:%H)"
    run git fetch origin
    run git checkout -f origin/main
    run git checkout -B "${BRANCH_NAME}" "${COMMIT_HASH}"
    run git push --set-upstream origin "pre-release/${RELEASE_ID}" || continue-approved "Push to remote failed. Continue anyway?"
  )
}

rename-branch() {
  local OLD_BRANCH="${1}" NEW_BRANCH="${2}"
  ## Local
  # Don't rename if already renamed
  if ! git branch --list | grep -q "^${NEW_BRANCH}$" &&
    ! git branch --list | grep -q "^${OLD_BRANCH}\$"; then
    run git branch -m "${OLD_BRANCH}" "${NEW_BRANCH}"
  fi
  run git fetch origin
  ## Remote
  if ! git branch -r | grep -q "origin/${NEW_BRANCH}"; then
    # Don't push new branch if it already exists
    run git push origin "${NEW_BRANCH}"
  fi
  run git branch -u "origin/${NEW_BRANCH}" "${NEW_BRANCH}"
  run git remote set-head origin -a
  run git fetch origin
  if git branch -r | grep -q "origin/${OLD_BRANCH}"; then
    run git push origin --delete "${OLD_BRANCH}"
  fi
}
promote-pre-release() {
  local REPO_PATH REPO_NAME="${1}" BRANCH_NAME="${2:-${RELEASE_BRANCH}}"
  BRANCH_NAME_PRE="pre-${BRANCH_NAME}"
  REPO_PATH="$(cd "../${REPO_NAME}" && pwd)"
  echo "Promoting ${BRANCH_NAME_PRE} --> ${BRANCH_NAME} on git repository '${REPO_PATH}'"
  (
    cd "${REPO_PATH}"
    rename-branch "${BRANCH_NAME_PRE}" "${BRANCH_NAME}"
  )
}

monitor-actions() {
  local REPO_NAME="${1}"
  continue-approved "$(echo -e "Monitor the workflow run at $(blue "$(get-actions-url "${REPO_NAME}")")")"
}
monitor-site() {
  local REPO_NAME="${1}"
  echo -e "Release URL will be available at $(blue "${RELEASE_URL}")"
  echo -n "Waiting for the site to come online "
  while ! run curl -s --fail "${RELEASE_URL}" &>/dev/null; do
    sleep "${RELEASE_SLEEP_TIME}"
    echo -n "."
  done && echo " SITE IS UP 👆"

  if ! continue-approved "$(echo -e "Please verify that the service portal is working as expected (${RELEASE_URL}/minarsidur)")"; then
    exit 1
  fi
}

dispatch-event() {
  local REPO_NAME="${1}" WORKFLOW_ID="${2}" BRANCH_NAME="${3}"
  # URI encode for well-formatted URL
  REPO_NAME="$(jq -rn --arg x "${REPO_NAME}" '$x|@uri')"
  WORKFLOW_ID="$(jq -rn --arg x "${WORKFLOW_ID}" '$x|@uri')"
  # From official docs:
  # https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
  cmd=(
    curl
    --fail
    -L
    -X "POST"
    -H "Accept: application/vnd.github+json"
    -H "Authorization: ${GITHUB_TOKEN:+Bearer ${GITHUB_TOKEN}}"
    -H "X-GitHub-Api-Version: 2022-11-28"
    "https://api.github.com/repos/${RELEASE_GITHUB_ORGANIZATION}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches"
    -d "{\"ref\":\"${BRANCH_NAME}\"}"
  )
  run "${cmd[@]}"
}

spinnaker-deploy() {
  local SPINNAKER_URL="${1}" SPINNAKER_ENV="${2}"
  # Capitalize first letter of SPINNAKER_ENV
  SPINNAKER_ENV="$(echo "${SPINNAKER_ENV:0:1}" | tr '[:lower:]' '[:upper:]')${SPINNAKER_ENV:1}"
  echo "Now go to ${SPINNAKER_URL}?pipeline=${SPINNAKER_ENV}"
  echo "Click \"➡  Start Manual Execution\" and fill in the values found in the actions above"
  continue-approved
}

## Pre-release
# island.is
create-pre-release "${RELEASE_ISLANDIS_NAME}"
monitor-actions "${RELEASE_ISLANDIS_NAME}"
monitor-site "${RELEASE_ISLANDIS_NAME}"
# helm
create-pre-release "${RELEASE_HELM_NAME}"
monitor-actions "${RELEASE_HELM_NAME}"
# identity-server.web
create-pre-release "${RELEASE_IDS_NAME}"
monitor-actions "${RELEASE_IDS_NAME}"

## Staging
export RELEASE_BRANCH="${RELEASE_BRANCH//pre-/}" ENV=staging
# island.is
promote-pre-release "${RELEASE_ISLANDIS_NAME}"
monitor-actions "${RELEASE_ISLANDIS_NAME}"
# helm
promote-pre-release "${RELEASE_HELM_NAME}"
monitor-actions "${RELEASE_HELM_NAME}"
# identity-server.web
promote-pre-release "${RELEASE_IDS_NAME}"
dispatch-event "${RELEASE_IDS_NAME}" "build.yml" "${RELEASE_BRANCH//pre-/}"
monitor-actions "${RELEASE_IDS_NAME}"
# Spinnaker deployment
spinnaker-deploy "${RELEASE_ISLANDIS_SPINNAKER_URL}" "${ENV}"
# Request monitoring
echo "Monitor service errors in DataDog (${RELEASE_DD_DASHBOARD_URL}?tpl_var_env[0]=${ENV})"

## Prod
export ENV=prod
# Spinnaker deployment
spinnaker-deploy "${RELEASE_ISLANDIS_SPINNAKER_URL}" "${ENV}"
# Request monitoring
echo "Monitor service errors in DataDog (${RELEASE_DD_DASHBOARD_URL}?tpl_var_env[0]=${ENV})"

echo -e "\n>\n> 🚀 Release complete! 🚀\n>\n"
