#!/bin/bash

set -euo pipefail

RED=$(echo -en '\033[00;31m')
GREEN=$(echo -en '\033[00;32m')
YELLOW=$(echo -en '\033[00;33m')
LBLUE=$(echo -en '\033[01;34m')
GRAY=$(echo -en '\033[01;90m')
RESET=$(echo -en '\033[0m')
SHOW_TIMESTAMP=${SHOW_TIMESTAMP:-}

function _log() {
  local color="$1"
  local level="$2"
  shift 2
  local msg="$*"
  local timestamp=""
  if [[ -n "${SHOW_TIMESTAMP}" ]]; then timestamp="$(date +"%Y-%m-%d %H:%M:%S.%3N %:z") "; fi
  echo "$msg" | while read -r line; do
    printf "${timestamp}${color}%10s %s${RESET}\n" "[$level]:" "${line}" >&2
  done
}

function debug() { [[ -z "${DEBUG:-}" ]] || _log "${GRAY}" "debug" "${*}"; }
function info() { _log "${LBLUE}" "info" "${*}"; }
function success() { _log "${GREEN}" "success" "${*}"; }
function error() { _log "${RED}" "error" "${*}"; }
function warning() { _log "${YELLOW}" "warn" "${*}"; }

function log() {
  local argv=("$@")
  local level="$1"
  shift
  case "$level" in
  success) success "$@" ;;
  error) error "$@" ;;
  warning) warning "$@" ;;
  debug) debug "$@" ;;
  info) info "$@" ;;
  *) info "${argv[*]}" ;;
  esac
}
