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
  [[ -d $1 ]] || {
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
  if [[ $1 = "$ILLEGAL_CHARS" ]]; then
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
prepare_secret() {
  # Prompt user for secret name
  read -erp "${BLUE}Secret name: ${RESET}${SSM_PREFIX}" SECRET_NAME
  validate_whitespace "$SECRET_NAME"
  validate_chars "$SECRET_NAME"
  validate_length "$SECRET_NAME"

  # Prompt user for secret value
  read -erp "${BLUE}Secret value: ${RESET}" SECRET_VALUE
  validate_whitespace "$SECRET_VALUE"
  validate_length "$SECRET_VALUE"

  # Prompt user for secret type
  read -erp "${BLUE}SecureString [Y/n]? ${RESET}"
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    SECRET_TYPE="String"
  else
    SECRET_TYPE="SecureString"
  fi
  printf "%s$SECRET_TYPE selected%s\n" "$GREEN" "$RESET"

  # Prompt user for adding tags
  TAGS=""
  read -erp "${BLUE}Add tags? [y/N]? ${RESET}"
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -erp "${YELLOW}Example: Key=Foo,Value=Bar Key=Another,Value=Tag: ${RESET}" TAGS
  fi
  read -erp "${YELLOW}Are you sure [Y/n]? ${RESET}"
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    printf "%sAborting...%s" "$RED" "$RESET"
  else
    printf "%sCreating secret....%s\n" "$GREEN" "$RESET"
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

case $1 in
validate_length)
  "$@"
  exit
  ;;
validate_chars)
  "$@"
  exit
  ;;
validate_whitespace)
  "$@"
  exit
  ;;
validate_empty)
  "$@"
  exit
  ;;
__error_exit)
  "$@"
  exit
  ;;
esac

prepare_secret
