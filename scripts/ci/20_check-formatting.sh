#!/bin/bash
set -euxo pipefail
action=${1:-"check"}
yarn nx format:"${action}" --all
