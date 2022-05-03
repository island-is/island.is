#!/bin/bash
set -euo pipefail

CURRENT=$1 # Current state of DB
TARGET=$2 # Targeted state of DB

DIFF="git diff --name-only $TARGET...$CURRENT -- $(find ../apps -name 'migrations')"

while IFS= read -r line; do
    echo "Undoing migration of: $line"
    npx sequelize-cli db:migrate:undo --name $line
done <<< "$DIFF"

echo "Sequilize Undo Complete"
