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
ALPHANUMERIC_DASH="^[a-zA-Z0-9\//_-]"

# Atleast one valid char
ONE_OR_MORE="+$"
# END="$"
# Exclude whitespaces
ILLEGAL_CHARS="*[[:space:]]*"
HAS_SLASH_END="[^\/]"

# Complete pattern
# PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$HAS_SLASH_END$END

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

  validate_length <string>         Validate that input is 6–128 characters
  validate_chars <string>          Validate that input contains only letters, numbers, /, -, _
  validate_whitespace <string>     Validate that input contains no whitespace
  validate_empty <string>          Validate that input is non-empty

${BLUE}Options:${RESET}
  -h, --help                       Show this help message and exit

${BLUE}Examples:${RESET}
  \$ $(basename "$0")
  \$ $(basename "$0") validate_length mySecret123
  \$ $(basename "$0") create --name my-secret --value secret123 --type SecureString --tags "Key=Env,Value=Prod"
EOF
}

__error_exit() {
  # printf "${RED}[ERROR]: $*${NOSTYLE}" >&2; exit 1;
  printf "%s[ERROR]: $*%s" "$RED" "$RESET" >&2
  exit 1
}

error_empty() {
  printf "%sNo empty values %s\n" "$RED" "$RESET"
  exit 0
}

validate_empty() {
  [[ -z $1 ]] || {
    printf "%sNo empty values%s" "$RED" "$RESET" >&2
    exit 1
  }
}

validate_slash() {
  [[ ! $1 =~ $HAS_SLASH_END ]]
  printf "%sNo ending slash: Ok!%s" "$GREEN" "$RESET"
}

validate_whitespace() {
  if [ ! ${1+x} ]; then
    error_empty
  fi
  # No whitespace
  # shellcheck disable=SC2053
  if [[ $1 = $ILLEGAL_CHARS ]]; then
    printf "%sWhitespaces are not allowed%s\n" "$RED" "$RESET"
    exit 0
  fi
}

validate_chars() {
  if [ ! ${1+x} ]; then
    error_empty
  fi
  if [[ $1 =~ $ALPHANUMERIC_DASH$ONE_OR_MORE ]]; then
    printf "%sName: Ok! %s\n" "$GREEN" "$RESET"
  else
    printf "%sSecret name can only contain letters, numbers, hyphens and underscores %s\n" "$RED" "$RESET"
    exit 0
  fi
}

validate_length() {
  # Unset parameter is an empty user input
  if [ ! ${1+x} ]; then
    error_empty
  fi

  # Validate minimum length
  if ((${#1} < MIN_LENGTH || ${#1} > MAX_LENGTH)); then
    printf "%sToo short, should be 6-256 characters long.%s\n" "$RED" "$RESET"
    exit 0
  else
    printf "%sLength: Ok! %s\n" "$GREEN" "$RESET"
  fi
}

#-------------------CREATE SECRET--------------------------#
parse_create_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --name)
      SECRET_NAME="$2"
      shift 2
      ;;
    --value)
      SECRET_VALUE="$2"
      shift 2
      ;;
    --type)
      SECRET_TYPE="$2"
      shift 2
      ;;
    --tags)
      TAGS="$2"
      shift 2
      ;;
    *)
      printf "Unknown option: %s\n" "$1" >&2
      exit 1
      ;;
    esac
  done
  # Defaults
  SECRET_TYPE="${SECRET_TYPE:-SecureString}"
  # Validations
  validate_whitespace "$SECRET_NAME"
  validate_chars "$SECRET_NAME"
  validate_length "$SECRET_NAME"
  validate_whitespace "$SECRET_VALUE"
  validate_length "$SECRET_VALUE"
  printf "%sCreating secret....%s\n" "$GREEN" "$RESET"
  create_secret "$SECRET_NAME" "$SECRET_VALUE" "$SECRET_TYPE" "$TAGS"
  exit 0
}
prepare_secret() {
  # Prompt user for secret name
  [[ -n "$SECRET_NAME" ]] || read -erp "${BLUE}Secret name: ${RESET}${SSM_PREFIX}" SECRET_NAME
  validate_whitespace "$SECRET_NAME"
  validate_chars "$SECRET_NAME"
  validate_length "$SECRET_NAME"

  # Prompt user for secret value
  [[ -n "$SECRET_VALUE" ]] || read -erp "${BLUE}Secret value: ${RESET}" SECRET_VALUE
  validate_whitespace "$SECRET_VALUE"
  validate_length "$SECRET_VALUE"

  # Prompt user for secret type
  if [[ -z "$SECRET_TYPE" ]]; then
    read -erp "${BLUE}SecureString [Y/n]? ${RESET}"
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      SECRET_TYPE="String"
    else
      SECRET_TYPE="SecureString"
    fi
  fi
  printf "%s$SECRET_TYPE selected%s\n" "$GREEN" "$RESET"

  # Prompt user for adding tags
  if [[ -z "$TAGS" ]]; then
    read -erp "${BLUE}Add tags? [y/N]? ${RESET}"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      read -erp "${YELLOW}Example: Key=Foo,Value=Bar Key=Another,Value=Tag: ${RESET}" TAGS
    fi
  fi
  read -erp "${YELLOW}Create the secret [Y/n]? ${RESET}"
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    printf "%sAborting...%s" "$RED" "$RESET"
  else
    printf "%sCreating /k8s/$SECRET_NAME as $SECRET_TYPE%s\n" "$GREEN" "$RESET"
    create_secret "$SECRET_NAME" "$SECRET_VALUE" "$SECRET_TYPE" "$TAGS"
  fi
}

create_secret() {
  SECRET_NAME=$1
  SECRET_VALUE=$2
  SECRET_TYPE=$3
  TAGS=$4
  CMD="aws ssm put-parameter --name $SSM_PREFIX$SECRET_NAME --value $SECRET_VALUE --type $SECRET_TYPE"

  if [ -n "$TAGS" ]; then
    CMD="$CMD --tags $TAGS"
  fi
  eval "$CMD"
  printf "%sDone!%s" "$GREEN" "$RESET"
}

case "$1" in
validate_length | validate_chars | validate_whitespace | validate_empty | __error_exit)
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
