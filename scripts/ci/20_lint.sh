#!/bin/bash
set -euxo pipefail

yarn run lint "${APP}"
