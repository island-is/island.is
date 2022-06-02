#!/bin/bash

set -euo pipefail

function stop_proxy() {
  local proxy builder
  proxy=${1}
  builder=${2}
  echo "Killing ${proxy} ..."
  ${builder} container stop $(${builder} container ls -q --filter name=${proxy})
}

builder=${1:-docker}
array=( socat-soffia socat-xroad es-proxy )
for proxy in "${array[@]}"
do
  stop_proxy "${proxy}" "${builder}"
done
