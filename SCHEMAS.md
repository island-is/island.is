# Schemas

```
cross-env INIT_SCHEMA=true
```

workspace.json

```json
"build-open-api": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/openapi.yaml",
    "command": "yarn ts-node -P PATH/tsconfig.app.json PATH/buildOpenApi.ts"
  }
},
```

buildOpenApi.ts

```ts
import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'PATH/openapi.yaml',
  appModule: AppModule,
  openApi,
})
```

openApi.ts

```ts
import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('title')
  .setDescription('description')
  .setVersion('version')
  .addTag('application')
  .build()
```

workspace.json

```json
"build-schema": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/api.graphql",
    "command": "yarn ts-node -P PATH/tsconfig.app.json PATH/buildSchema.ts"
  }
},
```

buildSchema.ts

```ts
import { buildSchema } from '@island.is/infra-nest-server'

buildSchema({
  path: 'PATH/src/api.graphql',
  resolvers: [...],
})
```

workspace.json

```json
"openapi-generator": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/gen/fetch",
    "command": "openapi-generator generate -g typescript-fetch --additional-properties=typescriptThreePlus=true -o PATH/gen/fetch -i PATH/openapi.yaml"
  }
}
```

We are using `buildSchema.ts` and `buildOpenApi.ts` over the following script, because it run ~3x faster locally and on the CI. The only downside is that we have to create a new file to invoke each function.

```json
"commands": [
  "yarn build user-profile-api",
  "node dist/apps/services/user-profile/main --generate-schema apps/services/user-profile/src/openapi.yaml"
]
```

## Schemas and types

All generated files are ignored from the git repository to avoid noises (except contentfulTypes.d.ts that we will keep tracked), to make reviews easier on PRs and don't notify teams with code reviews when not needed.

Once you do a `yarn install`/`npm install`, a postinstall script will generate all the schemas and types for the whole project. It takes around ~30sec to generate all schemas, definitions types and open api schemas.

The normal development process stays the same, `e.g. yarn start api` will keep generating on the fly the schemas files.

However, if you need to generate all the schemas files manually, you can do it with `yarn schemas`. Besides you can generate schemas, project by project with the following `yarn nx run <project>:init-schema`.

## Generating schemas and types for a new library/application

- You will need to create a `buildSchema.ts`, if your project has a graphql module. (e.g. [air-discount-scheme-api](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/air-discount-scheme/api/src/buildSchema.ts))
- You will need to create a `buildOpenApi`, if your project has an open api. (e.g. [application-system-api](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/application-system/api/src/buildOpenApi.ts))

TODO

- You will need to create a `codegen.yml`, if your project is a react application. (e.g. [adgerdir](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/apps/adgerdir/codegen.yml))

TODO
It's very common to create more than one file for the same project, for example the `buildSchema` and a `codegen`. Once you have one or multiple of these file, you can create your workspace architect:

- `yarn schemas` runs all the `init-schema` that it can find for all the targets inside the workspace. If you create a new `init-schema` and place it your newly created file it will be triggered during postinstall. (e.g. [air-discount-scheme-api architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L1584-L1593), [application-system-api architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L2032-L2037), [adgerdir architect](https://github.com/island-is/island.is/blob/1641df5f1b04c0a5caad3b07cff2f500566b6349/workspace.json#L2161-L2172))

## Generate schema and client types

All api calls should be type checked to backend schemas. When you update an API, you may need to generate schema files:

TODO

```
yarn nx run <project>:build-schema
```

And generate client types that depend on the schema:

TODO

```
yarn nx run <project>:codegen
```

## Postinstall

/\*\*

- Three options:
- - Your project depends on open api specification:
- -> You need to add a "build-open-api" script to your workspace project to create the openapi.yaml file (template here: TODO)
- -> You can use the openapi.yml file to generate the gen/fetch folder along openapi-generator (template here: TODO)
-
- - Your project depends on graphql:
- ->
-
- - Your project depends on react and is consuming one of them:
- ->
  \*/
