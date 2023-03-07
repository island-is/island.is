#!/bin/bash
set -euxo pipefail

DIR="$(git rev-parse --show-toplevel)"
"$DIR"/infra/scripts/generate-chart-values.sh

if [[ $(git diff --stat "$DIR"/charts) != '' ]]; then
  git config --global user.name "Chart bot"
  git config --global user.email "username@users.noreply.github.com"
  git commit -am "chore: update dirty charts"
  git push
else
  echo 'no changes to charts, nothing to commit'
fi