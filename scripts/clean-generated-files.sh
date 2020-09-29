#!/bin/bash

# For some reasons if the script to generate all the automatic files is failing
# and you can't do anything else, this script remove them all

find . -type f \( -name "openapi.yaml" -o -name "api.graphql" -o -name "schema.d.ts" -o -name "schema.tsx" -o -name "schema.ts" -o -name "possibleTypes.json" -o -name "fragmentTypes.json" \) -delete
