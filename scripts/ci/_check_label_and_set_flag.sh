#!/bin/bash
set -euo pipefail

LABELS="$1"
label="$2"
flag="$3"

if echo "$LABELS" | jq --arg labelName "$label" '.[] | select(.name == $labelName)? | any' | grep -q true; then
     echo "$flag"
fi
