#!/bin/bash

CI=$(test -f .env && grep CI .env | cut -d '=' -f2)

if [[ $CI != "true" ]]; then
  yarn schemas
fi
