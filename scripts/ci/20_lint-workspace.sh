#!/bin/bash
set -euxo pipefail

yarn run nx workspace-lint
yarn check-tags
