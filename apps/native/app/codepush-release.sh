#!/bin/bash
[[ ! -z "${DEBUG}" ]] && set -x
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT=$DIR/../../..

ORG=Stafraent-Island
TARGET=$1 # should be either ios or android
APP=Island-$TARGET
appcenter codepush deployment add -a ${ORG}/${APP} $CODEPUSH_DEPLOYMENT --quiet || true
set +u
if [[ -z "$GITHUB_HEAD_REF" ]] ; then
export LOG_MSG=$(git log -n 1 --pretty=format:'%s' --abbrev-commit)
else
export LOG_MSG=$(git log --no-merges -n 1 --pretty=format:'%s' --abbrev-commit)
fi
set -u
yarn nx bundle-${TARGET} native-app   
appcenter codepush release -a ${ORG}/${APP} -d $CODEPUSH_DEPLOYMENT -c $ROOT/dist/apps/native/app/$TARGET/main.bundle -t '*' --disable-duplicate-release-error --description "$(node -e 'console.log(JSON.stringify({rev:process.env.RELEASE_TAG, desc: process.env.LOG_MSG}))')"
