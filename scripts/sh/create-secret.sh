#!/bin/bash
set -e

# shellcheck disable=SC2034
{
  NORMAL="\x1b[0m"
  BOLD="\x1b[1m"
  FAINT="\x1b[2m"
  ITALIC="\x1b[3m"
  UNDERLINE="\x1b[4m"
  BLINK_SLOW="\x1b[5m"
  BLINK_RAPID="\x1b[6m"
  INVERSE="\x1b[7m"
  CONCEAL="\x1b[8m"
  CROSSED_OUT="\x1b[9m"
  # TEXT colors.
  BLACK="\x1b[30m"
  RED="\x1b[31m"
  GREEN="\x1b[32m"
  YELLOW="\x1b[33m"
  BLUE="\x1b[34m"
  MAGENTA="\x1b[35m"
  CYAN="\x1b[36m"
  WHITE="\x1b[37m"
  # BACKGROUND colors.
  BG_BLACK="\x1b[40m"
  BG_RED="\x1b[41m"
  BG_GREEN="\x1b[42m"
  BG_YELLOW="\x1b[43m"
  BG_BLUE="\x1b[44m"
  BG_MAGENTA="\x1b[45m"
  BG_CYAN="\x1b[46m"
  BG_WHITE="\x1b[47m"
  # RESETS
  NOSTYLE="\x1b[0m"
  NOUNDERLINE="\x1b[24m"
  NOINVERSE="\x1b[27m"
  NOCOLOR="\x1b[39m"
}
#---------------------------------------------------------------------------------------------------------------#
#--- Script for creating secrets (SecureString) in the AWS parameter store using the path /k8s/[secret-name]----#
#---------------------------------------------------------------------------------------------------------------#

#-------------------REGEX PATTERNS--------------------------#
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

__error_exit () {
  # echo "${RED}[ERROR]: $*${NOSTYLE}" >&2; exit 1;
  echo "${RED}[ERROR]: $*${NOSTYLE}">&2; exit 1;
}

# Complete pattern
# PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$HAS_SLASH_END$END


# function test_func() {
#   local -n _TEST_ASSERT_PASS=$1
#   local -n _TEST_ASSERT_FAIL=$2

#   for TEST_PATTERN in "${_TEST_ASSERT_PASS[@]}";
#     do
#       [[ $TEST_PATTERN =~ $PATTERN ]] && echo "TEST: PASSED -> " "$TEST_PATTERN" || echo "TEST: FAILED -> " "$TEST_PATTERN"
#     done
#   for TEST_PATTERN in "${_TEST_ASSERT_FAIL[@]}";
#     do
#       [[ ! $TEST_PATTERN =~ $PATTERN ]] && echo "TEST: PASSED -> " "$TEST_PATTERN" || echo "TEST: FAILED -> " "$TEST_PATTERN"
#     done
#   for TEST_PATTERN in "${_TEST_ASSERT_PASS[@]}";
#     do
#       echo "TEST FUNCTION: validate_whitespace  -> " "$TEST_PATTERN"
#       validate_whitespace "$TEST_PATTERN"
#       echo "TEST FUNCTION: validate_chars  -> " "$TEST_PATTERN"
#       validate_chars "$TEST_PATTERN"
#       validate_length "$TEST_PATTERN"
#     done
# }

die () {
    echo >&2 "$@"
    exit 1
}

error_empty () {
  echo "$RED No empty values $RESET"
  exit 0
}


validate_empty () {
# [[ -d $1 && $1 != *[^0-9]* ]] || { echo "Invalid input." >&2; exit 1; }
  [[ -d $1 ]] || { echo "$RED No empty values $RESET" >&2; exit 1; }
}

validate_slash () {
  # if [ ! ${1+x} ]
  # then
  #   error_empty
  # fi
  # No ending with forward slash
  [[ ! $1 =~ $HAS_SLASH_END ]]
  echo "$GREEN No ending slash: Ok! $RESET"

}

validate_whitespace () {
  if [ ! ${1+x} ]
  then
    error_empty
  fi
  # No whitespace
  if [[ $1 =~ $ILLEGAL_CHARS ]]
  then
    echo "$RED Whitespaces are not allowed $RESET"
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
    echo "$GREEN Name: Ok! $RESET"
  else
    echo "$RED Secret name can only contain letters, numbers, hyphens and underscores $RESET"
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
    echo "$GREEN Length: Ok! $RESET"
  else
    echo "$RED To short, should be 6-256 characters long. $RESET"
    exit 0
  fi
}

#-------------------CREATE SECRET--------------------------#
prepare_secret () {
  # Prompt user for secret name
  read -r -p "${BLUE}Secret name: $RESET"$SSM_PREFIX SECRET_NAME
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
    echo # newline
    echo "$GREEN Creating secret....$RESET"
    create_secret "$SECRET_NAME" "$SECRET_VALUE"
  else
    echo "$RED Aborting...$RESET"
  fi
}

create_secret () {
  SECRET_NAME=$1
  SECRET_VALUE=$2
  aws ssm put-parameter --name "$SSM_PREFIX$SECRET_NAME" --value "$SECRET_VALUE" --type SecureString
  echo "$GREEN Done! $RESET"
}


#-------------------TESTS--------------------------#
# To enable tests set env ISLANDIS_CREATE_SECRET_TEST=1

# if [ ${ISLANDIS_CREATE_SECRET_TEST+x} ]
# then
#   TEST_ASSERT_PASS=(
#     "some/path/to/secretname01_"
#     "some/path/to/secretname01"
#     "some/path/to/secret-name-01-"
#     "some/path/to/secret-name-01-_"
#     "/k8s/judicial-system/PRISON_ADMIN_EMAIL"
#   )
#   TEST_ASSERT_FAIL=(
#     "" # no empty
#     " " # no whitespace
#     "toshrt" # too short
#     "no/forward/slash/suffix/" # no forward slash suffix
#     "this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-longthis-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-longthis-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-longthis-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long" # too long
#     "some/path/to/}#!%" # no symbols
#     "some/path/to/secret-.name-with-dot." # no dots
#   )
#   # test_func TEST_ASSERT_PASS TEST_ASSERT_FAIL
#   . shunit2
# else
#   #-------------------MAIN SCOPE--------------------------#
#   prepare_secret
# fi
${__SOURCED__:+return}

case $1 in
    validate_length) "$@"; exit;;
    validate_chars) "$@"; exit;;
    validate_whitespace) "$@"; exit;;
    validate_empty) "$@"; exit;;
    __error_exit) "$@"; exit;;
esac

# prepare_secret