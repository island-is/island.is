#!/bin/bash

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
PROTECTED="main"


if [[ "$BRANCH" == "$PROTECTED" ]]; then
	echo "HOOK: Pushing to protected branch ($PROTECTED) 🙊"
	echo "HOOK: Use git push --no-verify to force this operation."
	exit 1
fi
