#!/bin/bash
set -euo pipefail

# Verifies that every unicorn project in the run has some tests.
#
# UNICORN_PROJECTS: comma separated projects, see `plan.mjs`

# Listing tests is not something to distribute to the agents (or cache), so this gets
# a CI execution of its own and runs on this machine
export NX_CLOUD_DISTRIBUTED_EXECUTION=false
export NX_CI_EXECUTION_ID="${NX_CI_EXECUTION_ID:-local}-unicorn-tests"

tmp=$(mktemp -d)

# Get list of tests, with `<project-name>: ` prefixed (stream style, without cache), grouping by unique prefixes (sorted).
# NO_COLOR=1: Nx 22 (picocolors) forces ANSI colour on the stream prefix in CI even when stdout is piped,
# so lines start with escape codes instead of the project name and the anchored grep below matches nothing.
NO_COLOR=1 yarn nx run-many -t test --skip-nx-cache --output-style=stream --projects="${UNICORN_PROJECTS}" --parallel --verbose -- --listTests |
  { grep -E "^(${UNICORN_PROJECTS//,/|}): " || true; } | cut -d':' -f1 | sort -u >"$tmp/projects-with-tests"
echo "${UNICORN_PROJECTS}" | tr ',' '\n' | sort -u >"$tmp/projects-all"

if ! d=$(diff "$tmp/projects-with-tests" "$tmp/projects-all"); then
  echo "These projects don't have any tests:"
  echo "${d}"
  exit 1
fi
echo "All projects ($UNICORN_PROJECTS) have tests."
