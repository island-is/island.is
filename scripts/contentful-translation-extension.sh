#!/bin/bash

CMD=$1
EXTENSION_ID=$2
TOKEN=$3
LIB_PATH=$4

if [[ -z $CMD ]] || [[ -z $EXTENSION_ID ]] || [[ -z $TOKEN ]] || [[ -z $LIB_PATH ]]; then
  echo "Missing arguments to run the command"
  exit 1
fi

extensionManagementToken=$TOKEN
extensionId=$EXTENSION_ID
extensionSpaceId="8k0h54kbe6bj"
extensionPath="$LIB_PATH"
extensionBuild="$extensionPath/build/index.html"

if [[ $CMD == "start" ]]; then
  contentful-extension-scripts start --basePath $extensionPath --id $extensionId --name $extensionId --space-id $extensionSpaceId --mt $extensionManagementToken
elif [[ $CMD == "build" ]]; then
  contentful-extension-scripts build --basePath $extensionPath
elif [[ $CMD == "deploy" ]]; then
  contentful-extension-scripts build --basePath $extensionPath && contentful extension update --id $extensionId --name $extensionId --space-id $extensionSpaceId --srcdoc $extensionBuild --mt $extensionManagementToken --force
fi
