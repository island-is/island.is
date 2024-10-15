# Nest Config

Wraps Nest's [Configuration](https://docs.nestjs.com/techniques/configuration) functionality with the following features:

- Validates that required environment variables are set.
- Supports fallback values for local development.
- Supports configurations that are disabled behind [Server Side Feature Flags](../../../handbook/technical-overview/devops/service-setup.md#server-side-feature-flags).
- Provides helpers for JSON encoded environment variables.
- Includes validation, transformation, and TypeScript types with Zod.

This configuration system should replace NX's environment files as the primary way to configure Nest modules in our APIs. This is especially useful as we create bigger and deeper module trees.

## Basic Usage

Firstly, define a configuration and a load function.

```typescript
import { defineConfig } from '@island.is/nest/config'

export const someModuleConfig = defineConfig({
  name: 'SomeModule',
  load: (env) => ({
    url: env.required('SOME_MODULE_URL', 'http://localhost:3000'),
    secret: env.required('SOME_MODULE_SECRET'),
    ttl: env.optionalJSON('SOME_MODULE_TTL') ?? 60,
  }),
})
```

These configuration definitions should ideally mirror [config blocks in our Helm DSL](https://github.com/island-is/infrastructure/issues/918).

The `env` object provides helpers to read values from the environment:

```typescript
interface EnvLoader {
  required(envVariable: string, devFallback?: string): string
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T
  optional(envVariable: string, devFallback?: string): string | undefined
  optionalJSON<T = any>(envVariable: string, devFallback?: T): T | undefined
}
```

These helpers have the following behaviour:

- The `required` helpers are designed for everything that needs to be configured in production. If something is missing, its behaviour depends on `NODE_ENV`:
  - In production, it crashes the process after logging something like this:
    `SomeModule is not configured. Missing environment variables: SOME_MODULE_URL, SOME_MODULE_SECRET`
  - In development, it returns the `devFallback` argument. If there is no `devFallback` specified, it logs a warning and keeps running with a partial configuration (`isConfigured === false`).
- The `optional` helpers are meant for optional configuration that might have good defaults.
  - If you want the same default value in dev and production, use: `env.optional('EMAIL') ?? 'island@island.is'`.
  - If you want different defaults or don't want any default value in production, use the `devFallback` argument: `env.optional('CACHE_URL', 'localhost:1122')`
- The `*JSON` variants try to parse the environment variable as JSON. This is very handy for boolean/numerical environment variables or more complex configurations. If you ever use these helpers, you should specify the expected types using the Zod schema. Any JSON parsing issues are logged as error before crashing the process (with `requiredJSON`).

### Injecting Module Config

After defining the config, you can inject it into services using its key. By using the `ConfigType` interface, you get a strongly-typed configuration object.

```typescript
import { Inject } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { someModuleConfig } from './someModule.config'

export class SomeModuleService {
  constructor(
    @Inject(someModuleConfig.KEY)
    private config: ConfigType<typeof someModuleConfig>,
  ) {
    config.isConfigured // boolean
    config.url // string
    config.secret // string
    config.ttl // number
  }
}
```

### Loading a Module and Its Configuration

Loading configuration happens through the root module like in NestJS's Config module.

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { SomeModuleModule, someModuleConfig } from '@island.is/some/module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        someModuleConfig,
        // ...
      ],
    }),
    SomeModuleModule,
    // ...
  ],
})
export class SomeAppModule {}
```

In this example, the module is configured and imported in the same place. In many cases, the module's configuration will be loaded in the root module but imported elsewhere. For instance, a hypothetical IdsModule may be imported in multiple places, all sharing a singleton configuration and services.

By listing configurations to load in the root module, it provides a good overview of all modules configured and used by the app. Developers and DevOps can navigate through the config definitions to see which environment variables are needed by each.

If someone accidentally imports a module that is not configured, NestJS stops the process with an error message specifying the missing configuration.

### Validating Configuration

Beyond validating missing environment variables with the `env.required` helpers, you can provide a Zod schema to validate the final object.

```typescript
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const SomeModuleConfig = z.object({
  url: z.string().url(),
  secret: z.string(),
  ttl: z.number().int().optional(),
})

export const someModuleConfig = defineConfig({
  name: 'SomeModule',
  schema: SomeModuleConfig,
  load: (env) => ({
    url: env.required('SOME_MODULE_URL', 'http://localhost:3000'),
    secret: env.required('SOME_MODULE_SECRET'),
    ttl: env.optionalJSON('SOME_MODULE_TTL') ?? 60,
  }),
})
```

This is especially useful for:

- Validating that configuration values are valid (URLs, regex, etc).
- Validating the type of values parsed by the `*JSON` helpers.
- Providing better TypeScript types for values parsed by the `*JSON` helpers.

If configuration validation fails, the process is stopped with an error similar to this:

> SomeModule is not configured. Validation failed with the following errors:
>
> - url is not a string.
> - ttl is not a number.

## Advanced Functionality

### Optional Config

If you have a module that can depend on a config optionally, it can use the `isConfigured` property to check if the config is provided. Then, in the module's imports, import the config definition with `registerOptional()`. This allows for a complete config to be optional, but if some property is provided, all required properties need to be provided.

_Warning: Only optional configs should be imported in the module itself. Required config should be loaded in the root module using the `ConfigModule.forRoot(...)`._

Checking if config is provided:

```ts
import { Inject } from '@nestjs/common'
import { ConfigType, OtherConfig } from '@island.is/nest/config'
import { SomeModuleConfig } from './someModule.config'

export class SomeClientService {
  constructor(
    @Inject(SomeModuleConfig.Key)
    private config: ConfigType<typeof SomeModuleConfig>,
    @Inject(OtherConfig.Key)
    private otherConfig: ConfigType<typeof OtherConfig>,
  ) {
    this.someProp = otherConfig.isConfigured
      ? otherConfig.someProp
      : 'Some default behaviour'
  }
}
```

Add the config as optional in the module.

```ts
import { ConfigModule } from '@island.is/nest/config'
import { SomeModuleConfig } from './someModule.config'
import { SomeClientService } from './someClient.service'

@Module({
  // SomeModuleConfig is imported in the root module
  imports: [OtherConfig.registerOptional()],
  providers: [SomeClientService],
  exports: [SomeClientService],
})
export class SomeClientModule {}
```

### Server Side Features

If you're working on server-side functionality or integrations that need to be on main, but aren't ready for staging or production, you can use [Server-Side Feature Flags](https://docs.devland.is/technical-overview/devops/service-setup#server-side-feature-flags) to disable the functionality. In these cases, entire module configurations may be missing, which would crash configuration loading.

To handle this, you can define a configuration to depend on a specific server-side feature:

```typescript
import { defineConfig } from '@island.is/nest/config'

const EXTERNAL_CLIENT_FEATURE = 'EXTERNAL_CLIENT'

export const someModuleConfig = defineConfig({
  name: 'ExternalClient',
  serverSideFeature: EXTERNAL_CLIENT_FEATURE,
  load: (env) => ({
    url: env.required('EXTERNAL_CLIENT_URL'),
  }),
})
```

When `serverSideFeature` is set, the config module is only loaded if the specified feature is turned on. Alternatively, the configuration object only has its `isConfigured` attribute set to false.

### Supporting Dynamic Configuration

You can support both global configuration as well as dynamic configuration by using your own injection key:

```typescript
// Snip

export const someModuleConfig = defineConfig({
  // Snip
})

// New:
export const SomeModuleConfigKey = 'SomeModuleConfigKey'
```

```typescript
import { Inject } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { someModuleConfig, SomeModuleConfigKey } from './someModule.config'

export class SomeModuleService {
  constructor(
    @Inject(SomeModuleConfigKey)
    private config: ConfigType<typeof someModuleConfig>,
  ) {}
}
```

The module can then provide the injection key using existing global configuration, as well as support dynamic module registration with an explicit config object:

```typescript
@Module({
  providers: [
    SomeModuleService,
    { provide: SomeModuleConfigKey, useExisting: featureFlagsConfig.KEY },
  ],
  exports: [SomeModuleService],
})
export class SomeModuleModule {
  static register(config: ConfigType<typeof featureFlagsConfig>) {
    return {
      module: SomeModuleModule,
      providers: [{ provide: SomeModuleConfigKey, useValue: config }],
    }
  }
}
```

To import a module with dynamic configuration, just call the register static function:

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { SomeModuleModule, someModuleConfig } from '@island.is/some/module'

@Module({
  imports: [
    SomeModuleModule.register({
      host: '',
      secret: '',
    }),
    // ...
  ],
})
export class SomeAppModule {}
```

## Running Unit Tests

Run `nx test nest-config` to execute the unit tests via [Jest](https://jestjs.io).
