#!/bin/bash
set -e

export AWS_PAGER=""

BLUE=$'\e[1;34m'
RED=$'\e[1;31m'
GREEN=$'\e[1;32m'
YELLOW=$'\e[1;33m'
RESET=$'\x1b[0m'

# Parameter store prefix
SSM_PREFIX="/k8s/"

# Minimum length
MIN_LENGTH="6"
MAX_LENGTH="128"

# Secret name can only be alphanumeric and dash
ALPHANUMERIC_DASH="^[a-zA-Z0-9\/\_-]+$"

ILLEGAL_CHARS="*[[:space:]]*"
HAS_SLASH_END="\/$"
SECRET_TYPE_OPTIONS='(SecureString|String)'

print_help() {
  cat <<EOF
${BLUE}Usage:${RESET}
  $(basename "$0") [command] [options]

${BLUE}Commands:${RESET}
  create                           Interactively create a secret
  create --name <name>
         --value <value>
         [--type <String|SecureString>]
         [--tags "Key=K,Value=V ..."]   Non-interactively create a secret

  validate_length <string>         Validate that input is ${MIN_LENGTH}–${MAX_LENGTH} characters
  validate_chars <string>          Validate that input contains only letters, numbers, /, -, _
  validate_whitespace <string>     Validate that input contains no whitespace
  validate_empty <string>          Validate that input is non-empty
  validate_slash <string>          Validate that input has no trailing slashes

${BLUE}Options:${RESET}
  -h, --help                       Show this help message and exit

${BLUE}Examples:${RESET}
  \$ $(basename "$0")
  \$ $(basename "$0") validate_length mySecret123
  \$ $(basename "$0") create --name my-secret --value secret123 --type SecureString --tags "Key=Env,Value=Prod"
EOF
}

__error_exit() {
  printf "%s[ERROR]: $*%s\n" "$RED" "$RESET" >&2
  exit 1
}

validate_empty() {
  local input="$1"
  [[ -n "$input" ]] || __error_exit "Input cannot be empty."
}

validate_slash() {
  local input="$1"
  [[ ! "$input" =~ $HAS_SLASH_END ]] || __error_exit "No trailing slashes allowed."
}

validate_whitespace() {
  local input="$1"
  validate_empty "$input"
  # shellcheck disable=SC2053
  if [[ "$input" = $ILLEGAL_CHARS ]]; then
    __error_exit "Whitespaces are not allowed."
  fi
}

validate_chars() {
  local input="$1"
  validate_empty "$input"
  if [[ "$input" =~ $ALPHANUMERIC_DASH ]]; then
    : # Valid
  else
    __error_exit "Secret name can only contain letters, numbers, hyphens, underscores, and forward slashes."
  fi
}

validate_length() {
  local input="$1"
  validate_empty "$input"
  if ((${#input} < MIN_LENGTH || ${#input} > MAX_LENGTH)); then
    __error_exit "Length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters."
  fi
}

validate_type() {
  local input_type="$1"
  validate_empty "$input_type"
  if [[ ! "$input_type" =~ ^$SECRET_TYPE_OPTIONS$ ]]; then
    __error_exit "Secret type must be one of $SECRET_TYPE_OPTIONS."
  fi
}

#-------------------CREATE SECRET--------------------------#
parse_create_args() {
  local _secret_name=""
  local _secret_value=""
  local _secret_type=""
  local _tags=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
    --name)
      _secret_name="$2"
      shift 2
      ;;
    --value)
      _secret_value="$2"
      shift 2
      ;;
    --type)
      _secret_type="$2"
      shift 2
      ;;
    --tags)
      _tags="$2"
      shift 2
      ;;
    *)
      __error_exit "Unknown option: $1"
      ;;
    esac
  done

  prepare_secret "$_secret_name" "$_secret_value" "$_secret_type" "$_tags"
}

prepare_secret() {
  local _secret_name="${1:-}"
  local _secret_value="${2:-}"
  local _secret_type="${3:-}"
  local _tags="${4:-}"

  # Prompt user for secret name
  if [[ -z "$_secret_name" ]]; then
    read -erp "${BLUE}Secret name: ${RESET}${SSM_PREFIX}" _secret_name
  fi
  validate_empty "$_secret_name"
  validate_whitespace "$_secret_name"
  validate_chars "$_secret_name"
  validate_length "$_secret_name"
  validate_slash "$_secret_name"

  # Prompt user for secret value
  if [[ -z "$_secret_value" ]]; then
    read -erp "${BLUE}Secret value: ${RESET}" _secret_value
  fi
  validate_empty "$_secret_value"
  validate_whitespace "$_secret_value"
  validate_length "$_secret_value"

  # Prompt user for secret type
  if [[ -z "$_secret_type" ]]; then
    read -erp "${BLUE}Use SecureString (Y/n)? ${RESET}"
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      _secret_type="String"
    else
      _secret_type="SecureString"
    fi
    printf "%s%s selected%s\n" "$GREEN" "$_secret_type" "$RESET"
  fi
  validate_type "$_secret_type"

  # Prompt user for adding tags
  if [[ -z "$_tags" ]]; then
    read -erp "${BLUE}Add tags (y/N)? ${RESET}"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      read -erp "${YELLOW}Enter tags (e.g., 'Key=Env,Value=Prod Key=Owner,Value=Team'): ${RESET}" _tags
    fi
  fi

  read -erp "${YELLOW}Create secret '${SSM_PREFIX}${_secret_name}' [Y/n]? ${RESET}"
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    printf "%sAborting...%s\n" "$RED" "$RESET"
  else
    printf "%sCreating %s%s as %s%s\n" "$GREEN" "$SSM_PREFIX" "$_secret_name" "$_secret_type" "$RESET"
    create_secret "$_secret_name" "$_secret_value" "$_secret_type" "$_tags"
  fi
}

create_secret() {
  local secret_name="$1"
  local secret_value="$2"
  local secret_type="$3"
  local tags="$4"

  local cmd=(aws ssm put-parameter --name "${SSM_PREFIX}${secret_name}" --value "$secret_value" --type "$secret_type")

  if [[ -n "$tags" ]]; then
    # shellcheck disable=SC2206
    cmd+=(--tags $tags) # Tags are space-separated, so no quotes here
  fi

  "${cmd[@]}"
  printf "%sDone!%s\n" "$GREEN" "$RESET"
}

case "$1" in
validate_length | validate_chars | validate_whitespace | validate_empty | validate_slash | validate_type | __error_exit)
  "$@"
  exit 0
  ;;
create)
  shift
  if [[ $# -eq 0 ]]; then
    prepare_secret
  else
    parse_create_args "$@"
  fi
  ;;
--help | -h)
  print_help
  exit 0
  ;;
*)
  print_help
  exit 1
  ;;
esac
