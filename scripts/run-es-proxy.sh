#!/bin/bash
set -euo pipefail

# This scripts sets up a local proxy for ElastSearch running in our Dev env
#
# You need to login to AWS portal and get some env variables as in step 1 here - https://github.com/island-is/handbook/blob/master/dockerizing.md#troubleshooting
# Then simply run the script

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker build -f $DIR/Dockerfile.proxy -t es-proxy . 
docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN -p 9200:9200 es-proxy