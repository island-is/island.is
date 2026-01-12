#!/bin/bash

set -euo pipefail

: "${FORCE:=false}"
: "${DELETE_OLD:=false}"
: "${OVERWRITE:=false}"
: "${DRY:=}"
: "${SECRETS:=}"
ACTION="$(test "$DELETE_OLD" = true && echo "move" || echo "copy")"

if echo "$SECRETS" | grep --color --invert-match -o -P '^(\S+:\S+(\s+)?)+$'; then
  echo "The SECRETS environment variable is not in the correct format."
  echo "Correct format is <from>:<to> <from>:<to> ..."
  echo "For example: 'A:B C:D E:F'"
  exit 1
fi

dry() {
  if [ $# -eq 0 ]; then
    test "$DRY" = true
    return $?
  fi
  if dry; then
    echo "(DRY) ~> $*" >&2
    return
  fi
  "$@"
}
aws() {
  if [ "$DRY" = true ]; then
    dry "aws $*" >&2
  else
    command aws "$@"
  fi
}

AWS_BIN=$(which aws)
AWS_VERSION=$(aws --version)
AWS_CALLER_IDENTITY=$(aws sts get-caller-identity)

echo "Supported parameters and their current value:"
echo "  FORCE=$FORCE"
echo "  DELETE_OLD=$DELETE_OLD"
echo "  OVERWRITE=$OVERWRITE"
echo "  DRY=$DRY"
echo "  SECRETS=$SECRETS"
echo ""
echo "Debug information:"
echo "  aws binary: $AWS_BIN"
echo "  AWS_PROFILE: ${AWS_PROFILE:-<unset>}"
echo "  aws-cli version: $AWS_VERSION"
echo "  Current AWS user: $AWS_CALLER_IDENTITY"
echo ""

if ! aws sts get-caller-identity &>/dev/null; then
  echo "You're not authenticated with AWS CLI. Please make sure you have the correct AWS_PROFILE set."
  if ! dry; then exit 1; fi
fi

AFFECTED_SECRETS=()
for secret in ${SECRETS}; do
  from="${secret%%:*}"
  to="${secret##*:}"
  echo ">> Performing $ACTION for secret '$from' --> '$to'"

  # Get value to copy
  value_from="$(aws ssm get-parameters \
    --name="$from" --with-decryption | jq -r '.Parameters[0].Value' || (
    code=$?
    echo "Failed getting secret for '$from'" >&2
    exit $code
  ))" ||
    continue
  if { [ "$value_from" = 'null' ] || [ -z "$value_from" ]; } && [ "$FORCE" != true ]; then
    echo "Secret '$from' does not exist, skipping"
    continue
  fi

  # Get old value (if exists)
  value_to="$(aws ssm get-parameters \
    --name="$to" --with-decryption | jq -r '.Parameters[0].Value')" ||
    echo "Secret for '$to' does not exist, will create new secret"

  # Don't re-do copy
  if [ "$value_from" = "$value_to" ] && [ "$DELETE_OLD" != true ] && [ "$FORCE" != true ]; then
    echo "Value for secret '$from' is the same as for secret '$to', skipping"
    continue
  fi

  # Fail on overwrite unless specified
  if [ "$value_to" != 'null' ] && [ "$OVERWRITE" != true ] && [ "$FORCE" != true ]; then
    echo "Secret '$to' already exists ($to=$value_to) and 'OVERWRITE != true', skipping"
    continue
  fi

  # Copy the secret
  (aws ssm put-parameter \
    --name="$to" \
    --type="SecureString" \
    --value="$value_from" \
    "$(test "$OVERWRITE" = true && echo "--overwrite" || echo "--no-overwrite")" &>/dev/null &&
    echo "Successfully copied secret '$from' --> '$to'" || [ "$FORCE" = true ]) ||
    continue

  AFFECTED_SECRETS+=("$from --> $to")
  if [ "$DELETE_OLD" = true ]; then
    echo "Deleting old secret '$to'"
    (aws ssm delete-parameter --name="$from" &>/dev/null &&
      echo "Successfully deleted secret '$from'" || [ "$FORCE" = true ]) || continue
  fi
done

# Report number of changed secrets
DRY_SUFFIX=$(dry && echo " (dry-run)") || :
echo "Performed successful ${ACTION} for ${#AFFECTED_SECRETS[@]} secrets${DRY_SUFFIX}."
echo "Affected secrets:"
for affected in "${AFFECTED_SECRETS[@]}"; do
  echo "  $affected"
done

echo "DONE"
