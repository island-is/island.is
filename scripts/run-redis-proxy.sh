#!/bin/bash
set -euo pipefail

# This scripts sets up a local proxy for ElastSearch running in our Dev env

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"$DIR"/_run-aws-eks-commands.js proxy --namespace socat --service socat-redis --port 6379 --proxy-port 6379 --cluster "${CLUSTER:-dev-cluster01}"
