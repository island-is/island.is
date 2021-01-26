#!/bin/bash
set -euo pipefail



# Creates a secret (SecureString) in the parameter store using the path /k8s/[secret-name]

## Colors
BLUE=$'\e[1;34m'
LIGHT_BLUE=$'\e[1;96m'
RED=$'\e[1;31m'
GREEN=$'\e[1;32m'
YELLOW=$'\e[1;33m'
RESET=$'\x1b[0m'

## Prompt user for secret name
read -p $BLUE'Secret name: '$RESET SECRET_NAME

## Minimum length
MIN_LENGTH="{6,16}"

## Secret name can only be alphanumeric and dash
ALPHANUMERIC_DASH="^[a-zA-Z0-9-]"

## Atleast one valid char
ONE_OR_MORE="+$"

## Exclude whitespaces
ILLEGAL_CHARS="^[^\s]*$"
## Complete pattern
PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$ONE_OR_MORE


# Main function
create_secret () {

  # Blank secret name not allowed
  if [ -z "$SECRET_NAME" ]
  then
    echo $RED'Secret name cannot be empty'
    exit 0
  fi

  # Validate characters
  if [[ ! $SECRET_NAME =~ $ALPHANUMERIC_DASH$ONE_OR_MORE ]]
  then
    echo $RED"Secret name can only contain letters, numbers and dash"$RESET
    exit 0
  fi

  # Validate minimum length
  if [[ ! $SECRET_NAME =~ $ALPHANUMERIC_DASH$MIN_LENGTH ]]
  then
    echo $RED'Secret name should be 6-16 characters long.'
    exit 0
  fi

  # [DEBUG] Validate regex pattern
  if [[ ! $SECRET_NAME =~ $PATTERN ]]
  then
    echo "This should not happen!"
    exit 0
  fi

  # Prompt user for secret value
  read -p $LIGHT_BLUE'Secret value: '$RESET SECRET_VALUE

  # [DEBUG] Validate regex pattern
  if [[ $SECRET_VALUE =~ $ILLEGAL_CHARS ]]
  then
    echo $RED"Whitespaces in secret value is not allowed"$RESET
    exit 0
  fi


  read -p $YELLOW"Are you sure [y/n]? "$RESET -r
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    echo # newline
    echo $GREEN"Creating secret...."$RESET
    exit 0
  else
    echo $RED"Aborting..."$RESET
  fi

}

create_secret