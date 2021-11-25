# OpenAPI

Our services are implemented using the NestJS framework which includes SwaggerUI/OpenAPI support. We should always include an OpenAPI document for our public REST services and use the SwaggerUI to make it accessible.

Our `infra-nest-server.bootstrap` accepts a parameter of type `OpenAPIObject` which is used to configure the SwaggerUI. The service should set the base properties in `openApi.ts` and then use [NestJS OpenAPI Decorators](https://docs.nestjs.com/openapi/decorators) on controllers, methods, models and DTOs.

Example of `openApi.ts`

```typescript
import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Public API')
  .setDescription(
    'Public API for IdentityServer.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .addServer(process.env.PUBLIC_URL ?? 'http://localhost:3370')
  .setVersion('1.0')
  .build()
```

For more details about OpenAPI support in NestJS read their [docs](https://docs.nestjs.com/openapi/introduction).

## Download the OpenAPI document

The SwaggerUI makes the document itself accessible on the same path with `-json` added. For example if the SwaggerUI is rendered on `https://innskra.island.is/api/swagger` then the document can be downloaded from `https://innskra.island.is/api/swagger-json`.

As the SwaggerUI is missing a download button, we should include a short message in the description field, how the document can be downloaded. This helps our service consumers to get the document for client and model generation.

## Setting server property

In the `openApi.ts` example above, we add the server property. To get the environment specific host details we use the environment variable `PUBLIC_URL`. This variable needs to be set in the service infra dsl (or helm chart if it's not yet part of the monorepo infra namespaces).

## Configuring SwaggerUI dependencies for esbuild

As we use esbuild to build and bundle our APIs, we need to add `swagger-ui-dist` to the `external` list in `esbuild.json` for our SwaggerUI to work in a production build.
