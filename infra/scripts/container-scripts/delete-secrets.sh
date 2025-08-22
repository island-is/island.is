#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

set -x
FEATURE_NAME=$1
echo "Deleting secrets for feature $FEATURE_NAME"

node secrets delete "/k8s/feature-$FEATURE_NAME"
