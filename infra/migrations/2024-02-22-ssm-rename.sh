#!/bin/bash

set -euo pipefail

# Rename SSM parameters due to naming change during the DSL improvements
# in https://github.com/island-is/island.is/pull/13717

: "${DRY:=true}"

secrets=(
  "air-discount-scheme/backend:air-discount-scheme-backend"
  "application-system/api:application-system-api"
  "service-portal/api:service-portal-api"
  "services-auth/api:servicesauth"
)

SECRETS=$(
  IFS=" "
  echo "${secrets[*]}"
)
export SECRETS
echo "Moving secrets: $SECRETS"
./infra/scripts/move-secrets.sh
