#!/usr/bin/env bash

set -euo pipefail


 yarn run --silent nx run external-contracts-tests:test --json --silent | tail -n 1 > report.json
 node -r esbuild-register jest-to-dd.ts report.json     