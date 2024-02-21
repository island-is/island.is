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
  echo "Copying secret '$from' --> '$to'"

  # Get value to copy
  value_from="$(aws ssm get-parameters \
    --name="$from" --with-decryption | jq -r '.Parameters[0].Value')" 2>/dev/null ||
    echo "Parsing value failed for secret '$from'" &&
    continue
  if [ -z "$value_from" ]; then
    echo "Secret '$from' does not exist, skipping"
    continue
  fi

  # Get old value (if exists)
  value_to="$(aws ssm get-parameters \
    --name="$to" --with-decryption | jq -r '.Parameters[0].Value')" 2>/dev/null ||
    echo "Parsing value failed for secret '$from', probably doesn't exist"

  # Don't re-do copy
  if [ "$value_from" = "$value_to" ]; then
    echo "Value for secret '$from' is the same as for secret '$to', skipping"
    continue
  fi

  # Copy the secret
  aws ssm put-parameter \
    --name="$to" \
    --type="SecureString" \
    --value="$value_from"
done
echo "Successfully copied secrets$(dry && echo " (dry-run)"): $SECRETS"
