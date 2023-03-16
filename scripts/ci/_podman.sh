#!/bin/bash
set -euxo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. "${DIR}/_docker.sh"

function podman_build() {
  mkargs local-cache=false
  builder_build podman
}
podman_build
