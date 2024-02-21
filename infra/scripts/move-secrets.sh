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

echo "SECRETS: '$SECRETS'"
echo "AWS_PROFILE: ${AWS_PROFILE:-<unset>}"
echo "aws-cli version: $(aws --version)"
echo "Current AWS user: $(aws sts get-caller-identity)"

if ! aws sts get-caller-identity &>/dev/null; then
  echo "You're not authenticated with AWS CLI. Please make sure you have the correct AWS_PROFILE set."
  if ! dry; then exit 1; fi
fi

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
