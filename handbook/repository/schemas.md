# Auto Generated Schemas

We ignore all the auto-generated files from the repository to avoid noises, make reviews easier on PRs, and only notifies teams with code reviews when needed.

{% hint style="warning" %}
You will need `java` installed on your machine to be able to run the `yarn schemas` command, more precisely the `openapi-generator` sub-command. Find more about the installation [here](https://github.com/OpenAPITools/openapi-generator#13---download-jar).
{% endhint %}

## Understanding how automatic schemas works

We are only tracking file that are coming from an external source, e.g. `contentfulTypes.d.ts` that depends on contentful to be generated. The same goes for an `openapi.yaml` file that comes from an external service.

When you do `yarn install` the scripts will generate all the schemas and types for the project. It takes around ~45sec to generate all schemas, definitions types and open api schemas. The output is cached using NX to avoid re-generating all files again when no changes have been detected. It can go down up to ~5sec to run again.

On the GitHub workflow, we are caching theses generated files to avoid to re-generate them at each push. However, theses files have to be updated when some specific files are changed (e.g. `*.resolvers.ts`, `*.dto.ts`, etc).

We defined a hashFiles variable in the GitHub workflow that contains the list of the files patterns that can trigger the schema script. If you follow this naming convention, your files will trigger the script once a change is detected on GitHub.

```text
scripts/schemas.js
libs/cms/src/lib/generated/contentfulTypes.d.ts
apps/air-discount-scheme/web/i18n/withLocale.tsx
apps/air-discount-scheme/web/components/AppLayout/AppLayout.tsx
apps/air-discount-scheme/web/components/Header/Header.tsx
apps/air-discount-scheme/web/screens/**.tsx
apps/gjafakort/api/src/**.typeDefs.ts
apps/**/codegen.yml
libs/**/codegen.yml
apps/**/*.model.ts
libs/**/*.model.ts
apps/**/*.enum.ts
libs/**/*.enum.ts
apps/**/queries/**/*.tsx?
libs/**/queries/**/*.tsx?
apps/**/*.resolver.ts
libs/**/*.resolver.ts
apps/**/*.service.ts
libs/**/*.service.ts
apps/**/*.dto.ts
libs/**/*.dto.ts
apps/**/*.input.ts
libs/**/*.input.ts
apps/**/*.module.ts
libs/**/*.module.ts
apps/**/*.controller.ts
libs/**/*.controller.ts
```

## Adding a new script for your project

We have 4 different types of scripts that can be added inside `workspace.json` to generate schemas and types.

- `schemas/build-openapi`
- `schemas/openapi-generator`
- `schemas/build-graphql-schema`
- `schemas/codegen`

Follow the next steps to configure your project:

---

### Openapi (schemas/build-openapi)

First, we need to create an `openApi.ts` file to define the document builder. Add this file at the root of the project along the `index.ts`.

```typescript
import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('title')
  .setDescription('description')
  .setVersion('version')
  .addTag('application')
  .build()
```

Next, we need to create an `buildOpenApi.ts` that will consume the previous file and generate the `openapi.yaml` file.

```typescript
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
"schemas/build-openapi": {
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

```typescript
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

{% hint style="info" %}
If the `.yaml` file comes from an outside source, don't name it openapi.yaml, otherwise it will be git ignored.
{% endhint %}

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

### Graphql (schemas/build-graphql-schema)

If you are creating an API, you'll need to hook up the `build-graphql-schema` script
in `workspace.json` so the CI can create the GraphQL schema in the pipeline without
starting running the server:

```json
"schemas/build-graphql-schema": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "command": "yarn ts-node -P PATH/tsconfig.json PATH_TO_ROOT_MODULE"
  }
}
```

---

### Client (schemas/codegen)

The last kind is the client-side consuming an `api.graphql` file.

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

{% hint style="info" %}
You should use one of the following names for the generated file from the codegen.yml configuration: `schema.d.ts`, `schema.tsx`, `schema.ts`, `possibleTypes.json`, `fragmentTypes.json` to be ignored from git.
{% endhint %}

## Generating schema and client types

If you are changing your openapi service, you might need to generate the files again using:

```bash
yarn nx run <project>:schemas/build-openapi
```

And generate the types fetch client with:

```bash
yarn nx run <project>:schemas/openapi-generator
```

All API calls should be type checked to backend schemas. When you update an API, you may need to generate schema files:

```bash
yarn nx run <project>:schemas/build-graphql-schema
```

And generate client types that depend on the schema:

```bash
yarn nx run <project>:schemas/codegen
```
