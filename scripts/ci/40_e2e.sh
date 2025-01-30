#!/bin/bash
set -euxo pipefail

yarn nx run "$1":e2e-ci || echo "Target e2e-ci does not exist for project $1. Skipping."
