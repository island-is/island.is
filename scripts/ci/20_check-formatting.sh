#!/bin/bash
set -euxo pipefail
action=${1:-check}
yarn run format:"${action}" --all
