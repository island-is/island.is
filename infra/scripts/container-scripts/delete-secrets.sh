#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

set -x
FEATURE_NAME=$1
echo "Deleting secrets for feature $FEATURE_NAME"

sleep 10

node secrets delete "/k8s/feature-$FEATURE_NAME"
