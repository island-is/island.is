#!/bin/bash
set -euo pipefail

# This scripts sets up a local proxy for soffia running in our Dev env

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

$DIR/run-proxy.js --namespace socat --service socat-soffia --port 443 --proxy-port 8443
