#!/bin/bash
set -euxo pipefail
action=${1:-"check"}
npx nx format:"${action}" --all