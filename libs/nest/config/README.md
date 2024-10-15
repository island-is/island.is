# Nest Config Documentation

This documentation provides an overview of the Nest Config package, which enhances Nest's [Configuration](https://docs.nestjs.com/techniques/configuration) functionality with additional features, including:

- Validation of required environment variables.
- Fallback values for local development.
- Support for configurations disabled by [Server Side Feature Flags](../../../handbook/technical-overview/devops/service-setup.md#server-side-feature-flags).
- Helpers for JSON-encoded environment variables.
- Validation, transformation, and TypeScript types using Zod.

This configuration system is intended to replace NX's environment files as the primary way to configure Nest modules in APIs, especially as we develop larger and more complex module trees.

## Basic Usage

Define a configuration and a load function.

```tsx
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

### Environment Loaders

The `env` object provides helpers to read values from the environment:

```tsx
interface EnvLoader {
  required(envVariable: string, devFallback?: string): string
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T
  optional(envVariable: string, devFallback?: string): string | undefined
  optionalJSON<T = any>(envVariable: string, devFallback?: T): T | undefined
}
```

The helpers behave as follows:

- **`required` Helpers**: Used for configurations required in production.
  - Crashes the process in production if a required variable is missing, logging the missing variables.
  - In development, returns `devFallback` or logs a warning and continues with partial configuration if `devFallback` is not specified.
- **`optional` Helpers**: Used for optional configurations with good defaults.
  - Allows for different defaults in dev and production, or a shared default using `??`.
- **JSON Variants**: Parse environment variables as JSON, which is useful for booleans, numbers, or more complex config values.
  - Specify types using Zod schema. JSON parsing errors are logged before crashing (with `requiredJSON`).

### Injecting Module Configurations

To inject configuration into services:

```tsx
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

Configurations are loaded through the root module as in NestJS's Config module.

```tsx
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

This provides an overview of all configured modules. Configurations are loaded in the root module but imported where needed.

### Validating Configuration

Use Zod schema to validate the final configuration object:

```tsx
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

Validation ensures:

- Configuration values are valid (e.g., URLs).
- Correct types for JSON-parsed values.
- Better TypeScript types for JSON-parsed values.

If validation fails, the process stops with detailed errors.

## Advanced Functionality

### Optional Configurations

Modules that depend on optional configs can use the `isConfigured` property. Import the config definition with `registerOptional()` to make it optional.

**Usage:**

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

Add the config as optional in the module:

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

### Server-Side Features

Use [Server-Side Feature Flags](https://docs.devland.is/technical-overview/devops/service-setup#server-side-feature-flags) for server-side functionality:

```tsx
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

When `serverSideFeature` is set, the config module loads only if the feature is enabled.

### Dynamic Configuration Support

Support both global and dynamic configuration using an injection key:

```tsx
// Snip

export const someModuleConfig = defineConfig({
  // Snip
})

// New:
export const SomeModuleConfigKey = 'SomeModuleConfigKey'
```

```tsx
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

Provide the injection key using global config, and support dynamic module registration:

```tsx
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

To import a module with dynamic configuration:

```tsx
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

