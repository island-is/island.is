#!/bin/bash
set -euxo pipefail

APP="${1:-$APP}"

yarn nx run "$APP":e2e-ci
