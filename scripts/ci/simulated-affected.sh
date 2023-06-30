#!/bin/bash

set -euox pipefail

find ./apps -type d -name "src" | while read -r dir; do
    echo 'console.log("this file should be deleted");' > "${dir}/deleteme.ts"
done
