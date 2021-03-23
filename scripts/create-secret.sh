#!/bin/bash
set -e

BLUE=$'\e[1;34m'
RED=$'\e[1;31m'
GREEN=$'\e[1;32m'
YELLOW=$'\e[1;33m'
RESET=$'\x1b[0m'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Parameter store prefix
SSM_PREFIX="/k8s/"

# Minimum length
MIN_LENGTH="{6,128}"

# Secret name can only be alphanumeric and dash
ALPHANUMERIC_DASH="^[a-zA-Z0-9\/_-]"

# Atleast one valid char
ONE_OR_MORE="+$"
# END="$"
# Exclude whitespaces
ILLEGAL_CHARS="\s"
HAS_SLASH_END="[^\/]"


# Complete pattern
# PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$HAS_SLASH_END$END

__error_exit () {
  # printf "${RED}[ERROR]: $*${NOSTYLE}" >&2; exit 1;
  printf "%s[ERROR]: $*%s" "$RED" "$RESET" >&2; exit 1;
}

die () {
    printf >&2 "$@"
    exit 1
}
error_empty () {
  printf "%s No empty values %s\n" "$RED" "$RESET"
  exit 0
}


validate_empty () {
  [[ -d $1 ]] || { printf "%sNo empty values%s" "$RED" "$RESET" >&2; exit 1; }
}

validate_slash () {
  [[ ! $1 =~ $HAS_SLASH_END ]]
  printf "%sNo ending slash: Ok!%s" "$GREEN" "$RESET"

}

validate_whitespace () {
  if [ ! ${1+x} ]
  then
    error_empty
  fi
  # No whitespace
  if [[ $1 =~ $ILLEGAL_CHARS ]]
  then
    printf "%sWhitespaces are not allowed%s" "$RED" "$RESET"
    exit 0
  fi
}


validate_chars () {
  if [ ! ${1+x} ]
  then
    error_empty
  fi
  if [[ $1 =~ $ALPHANUMERIC_DASH$ONE_OR_MORE ]]
  then
    printf "%s Name: Ok! %s\n" "$GREEN" "$RESET"
  else
    printf "%s Secret name can only contain letters, numbers, hyphens and underscores %s\n" "$RED" "$RESET"
    exit 0
  fi
}

validate_length () {
  # Unset parameter is an empty user input
  if [ ! ${1+x} ]
  then
    error_empty
  fi

  # Validate minimum length
  if [[ $1 =~ $ALPHANUMERIC_DASH$MIN_LENGTH ]]
  then
    printf "%s Length: Ok! %s\n" "$GREEN" "$RESET"
  else
    printf "%s To short, should be 6-256 characters long.%s\n" "$RED" "$RESET"
    exit 0
  fi
}

#-------------------CREATE SECRET--------------------------#
prepare_secret () {
  # Prompt user for secret name
  read -r -p "$BLUE Secret name: $RESET$SSM_PREFIX" SECRET_NAME
  validate_whitespace "$SECRET_NAME"
  validate_chars "$SECRET_NAME"
  validate_length "$SECRET_NAME"

  # Prompt user for secret value
  read -r -p "$BLUE Secret value: $RESET" SECRET_VALUE
  validate_whitespace "$SECRET_VALUE"
  validate_length "$SECRET_VALUE"


  read -r -p "$YELLOW Are you sure [y/n]? $RESET"
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    printf "%sCreating secret....%s\n" "$GREEN" "$RESET"
    create_secret "$SECRET_NAME" "$SECRET_VALUE"
  else
    printf "%sAborting...%s" "$RED" "$RESET"
  fi
}

create_secret () {
  SECRET_NAME=$1
  SECRET_VALUE=$2
  aws ssm put-parameter --name "$SSM_PREFIX$SECRET_NAME" --value "$SECRET_VALUE" --type SecureString
  printf "%sDone!%s" "$GREEN" "$RESET"
}

case $1 in
    validate_length) "$@"; exit;;
    validate_chars) "$@"; exit;;
    validate_whitespace) "$@"; exit;;
    validate_empty) "$@"; exit;;
    __error_exit) "$@"; exit;;
esac

prepare_secret