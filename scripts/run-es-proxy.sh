#!/bin/bash
set -euo pipefail

# This scripts sets up a local proxy for ElastSearch running in our Dev env

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"$DIR"/_run-aws-eks-commands.js proxy --namespace es-proxy --service es-proxy --port 9200 --proxy-port 9200 --cluster "${CLUSTER:-dev-cluster01}" "$@"
