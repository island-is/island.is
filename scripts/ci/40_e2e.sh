#!/bin/bash
set -euxo pipefail

yarn nx run "$1":e2e-ci
