#!/bin/bash
set -euxo pipefail

APP="${1:-$APP}"
TARGET="${2:-e2e-ci}"

# Exit gracefully if the target is not defined
if [ -z "$(nx show projects --projects "$APP" --with-target "$TARGET")" ]; then
  echo "Project $APP has no target $TARGET"
  exit 0
fi
yarn nx run "$APP":"$TARGET"
