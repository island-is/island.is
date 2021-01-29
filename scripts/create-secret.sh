#!/bin/bash
set -euo pipefail

#---------------------------------------------------------------------------------------------------------------#
#--- Script for creating secrets (SecureString) in the AWS parameter store using the path /k8s/[secret-name]----#
#---------------------------------------------------------------------------------------------------------------#

#-------------------COLORS--------------------------#
BLUE=$'\e[1;34m'
RED=$'\e[1;31m'
GREEN=$'\e[1;32m'
YELLOW=$'\e[1;33m'
RESET=$'\x1b[0m'

#-------------------REGEX PATTERNS--------------------------#
# Parameter store prefix
SSM_PREFIX="/k8s/"

# Minimum length
MIN_LENGTH="{6,32}"

# Secret name can only be alphanumeric and dash
ALPHANUMERIC_DASH="^[a-zA-Z0-9\/-]"

# Atleast one valid char
ONE_OR_MORE="+$"

# Exclude whitespaces
ILLEGAL_CHARS="\s"
HAS_SLASH_END="\/$"

# Complete pattern
PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$ONE_OR_MORE


function test_func() {
  local -n _TEST_ASSERT_PASS=$1
  local -n _TEST_ASSERT_FAIL=$2

  for TEST_PATTERN in "${_TEST_ASSERT_PASS[@]}";
    do
      [[ $TEST_PATTERN =~ $ALPHANUMERIC_DASH$PATTERN ]] && echo "TEST: FAILED -> "$TEST_PATTERN || echo "TEST: PASSED -> "$TEST_PATTERN
    done
  for TEST_PATTERN in "${_TEST_ASSERT_FAIL[@]}";
    do
      [[ ! $TEST_PATTERN =~ $ALPHANUMERIC_DASH$PATTERN ]] && echo "TEST: PASSED -> "$TEST_PATTERN || echo "TEST: FAILED -> "$TEST_PATTERN
    done
  for TEST_PATTERN in "${_TEST_ASSERT_PASS[@]}";
    do
      echo "TEST FUNCTION: validate_whitespace  -> "$TEST_PATTERN
      validate_whitespace $TEST_PATTERN
      echo "TEST FUNCTION: validate_chars  -> "$TEST_PATTERN
      validate_chars $TEST_PATTERN
      validate_length $TEST_PATTERN
    done
}

function error_empty() {
  echo $RED'No empty values'
  exit 0
}
function validate_whitespace() {
  if [ ! ${1+x} ]
  then
    error_empty
  fi
  # No whitespace
  if [[ $1 =~ $ILLEGAL_CHARS ]]
  then
    echo $RED"Whitespaces are not allowed"$RESET
    exit 0
  fi
}


function validate_chars() {
  if [ ! ${1+x} ]
  then
    error_empty
  fi
  if [[ $1 =~ $ALPHANUMERIC_DASH$ONE_OR_MORE ]]
  then
    echo $GREEN"Name: Ok!"$RESET
  else
    echo $RED"Secret name can only contain letters, numbers and dash"$RESET
    exit 0
  fi
  if [[ $1 =~ $HAS_SLASH_END ]]
  then
    echo $RED"Secret name cannot end with /"$RESET
    exit 0
  else
    echo $GREEN"No ending slash: Ok!"$RESET
  fi
}

function validate_length() {
  # Unset parameter is an empty user input
  if [ ! ${1+x} ]
  then
    error_empty
  fi

  # Validate minimum length
  if [[ $1 =~ $ALPHANUMERIC_DASH$MIN_LENGTH ]]
  then
    echo $GREEN'Length: Ok!'$RESET
  else
    echo $RED'To short, should be 6-16 characters long.'$RESET
    exit 0
  fi
}

#-------------------CREATE SECRET--------------------------#
function prepare_secret () {
  # Prompt user for secret name
  read -p $BLUE"Secret name: $RESET$SSM_PREFIX" SECRET_NAME
  echo $SECRET_NAME
  validate_whitespace "$SECRET_NAME"
  validate_chars "$SECRET_NAME"
  validate_length "$SECRET_NAME"

  # Prompt user for secret value
  read -p $BLUE'Secret value: '$RESET SECRET_VALUE
  validate_whitespace "$SECRET_VALUE"
  validate_length "$SECRET_VALUE"


  read -p $YELLOW"Are you sure [y/n]? "$RESET -r
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    echo # newline
    echo $GREEN"Creating secret...."$RESET
    create_secret $SECRET_NAME $SECRET_VALUE
  else
    echo $RED"Aborting..."$RESET
  fi
}

function create_secret () {
  SECRET_NAME=$1
  SECRET_VALUE=$2
  aws ssm put-parameter --name $SSM_PREFIX$SECRET_NAME --value $SECRET_VALUE --type SecureString
  echo $GREEN"Done!"$RESET
}


#-------------------TESTS--------------------------#
# To enable tests set env ISLANDIS_CREATE_SECRET_TEST=1

if [ ${ISLANDIS_CREATE_SECRET_TEST+x} ]
then
  TEST_ASSERT_PASS=(
    "some/path/to/secretname01"
    "some/path/to/secret-name-01"
    "some/path/to/secret-name-01--"
  )
  TEST_ASSERT_FAIL=(
    "" # no empty
    " " # no whitespace
    "toshrt" # too short
    "no/forward/slash/" # no forward slash suffix
    "this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long-this-secret-name-is-too-long" # too short
    "some/path/to/}#!%" # no symbols
    "some/path/to/secret-name-01.some-name_" # no dots or underscore
  )
  test_func TEST_ASSERT_PASS TEST_ASSERT_FAIL
fi

#-------------------MAIN SCOPE--------------------------#
prepare_secret