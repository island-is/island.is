#!/bin/bash
yarn nx run api:schemas/build-graphql-schema --skip-nx-cache
yarn nx run api:schemas/codegen --skip-nx-cache
# yarn nx run web:schemas/codegen --skip-nx-cache
# yarn nx run api-mocks:schemas/codegen --skip-nx-cache
# yarn nx run regulations-admin-backend:schemas/build-openapi --skip-nx-cache
