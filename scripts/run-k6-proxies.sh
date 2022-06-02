#!/bin/bash

./scripts/run-es-proxy.sh "$@" & ./scripts/run-soffia-proxy.sh "$@" & ./scripts/run-xroad-proxy.sh "$@" &
