#!/bin/bash
set -euxo pipefail
action=${1:-"check"}
yarn nx affected format:"${action}"