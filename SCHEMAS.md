# Schemas

## Adding a new script for your project

We are ignoring all the auto-generated files from the repository to avoid noises, to make reviews easier on PRs and don't notify teams with code reviews when not needed.

We are only tracking file that are coming from an external source, e.g. contentfulTypes.d.ts that depends on contentful to be generated. The same goes for an openapi.yaml file that comes from an external service.

When you do `yarn install` the scripts will generate all the schemas and types for the project. It takes around ~45sec to generate all schemas, definitions types and open api schemas. The output is cached using nx to avoid re-generating all files again if no changes have been detected. In this case it will around ~5sec to run again.

We have 4 different types of scripts that can be added inside `workspace.json` to generate schemas and types.

- `schemas/build-open-api`
- `schemas/openapi-generator`
- `schemas/build-schema`
- `schemas/codegen`

Follow the next steps to configure your project:

---

### Openapi (schemas/build-open-api)

First we need to create an `openApi.ts` file to define the document builder. Add this file at the root of the project along the `index.ts`.

```ts
import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('title')
  .setDescription('description')
  .setVersion('version')
  .addTag('application')
  .build()
```

Next, we need to create an `buildOpenApi.ts` that will consume the previous file and generate the `openapi.yaml` file.

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

Finally, we add the script into `workspace.json` for the project.

```json
"schemas/build-open-api": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/openapi.yaml",
    "command": "yarn ts-node -P PATH/tsconfig.app.json PATH/buildOpenApi.ts"
  }
}
```

If your service is running a service like redis, you will need to ignore it for running the build-open-api script like follow in the `workspace.json`

```json
"command": "cross-env INIT_SCHEMA=true yarn ts-node ..."
```

and in the module where the redis manager is defined

```ts
if (process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.register({
    store: redisStore,
    redisInstance: createNestJSCache({...}),
  })
}
```

---

### Typed fetch client (schemas/openapi-generator)

We will now use the `openapi.yaml` file generated from the previous script to run `openapi-generator`.

> If the `.yaml` file comes from an outside source, don't name it openapi.yaml, otherwise it will be git ignored.

Add the following script to the `workspace.json`'s project.

```json
"schemas/openapi-generator": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/gen/fetch",
    "command": "yarn openapi-generator -o PATH/gen/fetch -i PATH/openapi.yaml"
  }
}
```

---

### Graphql (schemas/build-schema)

If you are creating an API, you will need to create a `buildSchema.ts` at the root of the project, along `index.ts` as follow:

```ts
import { buildSchema } from '@island.is/infra-nest-server'

buildSchema({
  path: 'PATH/api.graphql',
  resolvers: [...], // Define all the resolvers used by the api
})
```

Then you can add it to the `workspace.json`

```json
"schemas/build-schema": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "PATH/api.graphql",
    "command": "yarn ts-node -P PATH/tsconfig.app.json PATH/buildSchema.ts"
  }
}
```

---

### Client (schemas/codegen)

Last kind is the client-side consuming an `api.graphql` file.

Create an `codegen.yml` file in your project

```yml
schema:
  - PATH/api.graphql
generates:
  PATH/schema.d.ts:
    plugins:
      - ...
hooks:
  afterAllFileWrite:
    - prettier --write
```

Finally, you need to add it inside your `workspace.json`

```json
"schemas/codegen": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "command": "graphql-codegen --config PATH/codegen.yml"
  }
}
```

> You should use one of the following name for the generated file from the codegen.yml configuration: `schema.d.ts`, `schema.tsx`, `schema.ts`, `possibleTypes.json`, `fragmentTypes.json` to be ignored from git.

## Generating schema and client types

If you are changing your openapi service, you might need to generate the files again using:

```bash
yarn nx run <project>:schemas/build-open-api
```

And generate the types fetch client with:

```bash
yarn nx run <project>:schemas/openapi-generator
```

All api calls should be type checked to backend schemas. When you update an API, you may need to generate schema files:

```bash
yarn nx run <project>:schemas/build-schema
```

And generate client types that depend on the schema:

```bash
yarn nx run <project>:schemas/codegen
```
