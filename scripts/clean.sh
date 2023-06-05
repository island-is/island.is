#!/bin/bash

set -euo pipefail

./scripts/clean-generated-files.sh

rm -rf .cache/ node_modules/ dist/

shopt -s extglob
rm -rf .yarn/!(patches|releases)
