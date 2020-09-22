#!/bin/bash

# For some reasons if the script to generate all the automatic files is failing
# and you can't do anything else, this script remove them all

rm apps/api/src/api.graphql
rm apps/web/graphql/fragmentTypes.json
rm apps/web/graphql/schema.ts
rm apps/gjafakort/api/src/types/schema.d.ts
rm apps/gjafakort/web/graphql/schema.tsx
rm apps/gjafakort/web/graphql/possibleTypes.json
rm apps/air-discount-scheme/api.graphql
rm apps/air-discount-scheme/web/graphql/schema.tsx
rm apps/air-discount-scheme/web/graphql/possibleTypes.json
rm apps/skilavottord/ws/src/app/api.graphql
rm libs/api/schema/src/lib/schema.d.ts
# rm libs/api/domains/cms/src/lib/generated/contentfulTypes.d.ts
