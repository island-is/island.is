#!/bin/bash
set -euo pipefail



# Creates a secret (SecureString) in the parameter store using the path /k8s/[secret-name]

## Colors
BLUE=$'\e[1;34m'
RED=$'\e[1;31m'
GREEN=$'\e[1;32m'

## Prompt user for secret name
read -p $BLUE'Secret name: ' SECRET_NAME

# Minimum length
MIN_LENGTH="{6,16}"

# Secret name can only be alphanumeric and dash
ALPHANUMERIC_DASH="^[a-zA-Z0-9-]"

# Atleast one valid char
ONE_OR_MORE="+$"

# Complete pattern
PATTERN=$ALPHANUMERIC_DASH$MIN_LENGTH$ONE_OR_MORE

# Blank secret name not allowed
if [ -z "$SECRET_NAME" ]
then
    echo $RED'Secret name cannot be empty'
    exit 0
fi

# Validate characters
if [[ ! $SECRET_NAME =~ $ALPHANUMERIC_DASH$ONE_OR_MORE ]]
then
    echo $RED"Secret name can only contain letters, numbers and dash"
    exit 0
fi

# Validate minimum length
if [[ ! $SECRET_NAME =~ $ALPHANUMERIC_DASH$MIN_LENGTH ]]
then
    echo $RED'Secret name should be 6-16 characters long.'
    exit 0
fi

# Validate regex pattern
if [[ $SECRET_NAME =~ $PATTERN ]]
then
    echo $GREEN"Success!"
    exit 0
else
    echo "This should not happen!"
    exit 0
fi