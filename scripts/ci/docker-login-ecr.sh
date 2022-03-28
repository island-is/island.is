#!/bin/bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1091
source "$DIR"/_common.sh

aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin "${DOCKER_REGISTRY}"
