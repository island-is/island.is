#!/bin/bash

set -euo pipefail

if [[ $CONFIGURATION =~ "Debug" ]]; then
  echo "good"
fi
