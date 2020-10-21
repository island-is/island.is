#!/bin/bash

# workaround for missing feature
# https://github.com/yarnpkg/yarn/issues/6669
#

 # "security-audit": "bash -c 'yarn audit --level moderate ; [[ \"$?\" -lt  \"4\" ]]'",


set -u

AUDIT_CMD='yarn audit --json --level moderate'

set +e
output=$($AUDIT_CMD)
result=$?
set -e

if [ $result -eq 0 ]; then
    # everything is fine
    exit 0
fi

if [ -f yarn-audit-known-issues ] && echo "$output" | grep auditAdvisory | diff -q yarn-audit-known-issues - > /dev/null 2>&1; then
    echo
    echo Ignorning known vulnerabilities
    exit 0
fi

echo
echo Security vulnerabilities were found that were not ignored
echo
echo Check to see if these vulnerabilities apply to production
echo and/or if they have fixes available. If they do not have
echo fixes and they do not apply to production, you may ignore them
echo
echo To ignore these vulnerabilities, run:
echo
echo "$AUDIT_CMD | grep auditAdvisory > yarn-audit-known-issues"
echo
echo and commit the yarn-audit-known-issues file
echo
echo "$output" | grep auditAdvisory | python -mjson.tool

exit "$result"