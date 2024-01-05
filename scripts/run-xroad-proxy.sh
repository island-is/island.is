#!/bin/bash
set -euo pipefail

# This scripts sets up a local proxy for X-Road running in our Dev env

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"$DIR"/_run-aws-eks-commands.js proxy --namespace socat --service socat-xroad --port 80 --proxy-port 8081 --cluster "${CLUSTER:-dev-cluster01}" "$@"
