#!/bin/bash

set -euo pipefail

: "${DELETE_OLD:=false}"
: "${DRY:=true}"
: "${SECRETS:=}"

if echo "$SECRETS" | grep --color --invert-match -o -P '^(\S+:\S+(\s+)?)+$'; then
  echo "The SECRETS environment variable is not in the correct format."
  echo "Correct format is <from>:<to> <from>:<to> ..."
  echo "For example: 'A:B C:D E:F'"
  exit 1
fi

dry() {
  if [ $# -eq 0 ]; then
    test "$DRY" = "true"
    return $?
  fi
  if dry; then
    echo "~> $*" >&2
    return
  fi
  "$@"
}
aws() {
  if [ "$DRY" = "true" ]; then
    dry "aws $*" >&2
  else
    command aws "$@"
  fi
}

for secret in ${SECRETS}; do
  from="${secret%%:*}"
  to="${secret##*:}"
  echo "Moving secret '$from' --> '$to'"
  secretValue="$(aws ssm get-parameters \
    --name="$from" --with-decryption)"
  if [ -z "$secretValue" ]; then
    echo "Secret '$from' does not exist, skipping"
    continue
  fi
  value="$(jq -r '.Parameters[0].Value' <<<"$secretValue")" &&
    aws ssm put-parameter \
      --name="$to" \
      --type="SecureString" \
      --value="$value"
done
echo "Successfully moved secrets$(dry && echo " (dry-run)"): $SECRETS"
