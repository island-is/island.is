# Nest Config

Enhances Nest's [Configuration](https://docs.nestjs.com/techniques/configuration) with:

- Validation of required environment variables.
- Fallbacks for local development.
- Configurations conditional on [Server Side Feature Flags](../../../handbook/technical-overview/devops/service-setup.md#server-side-feature-flags).
- Helpers for JSON-encoded environment variables.
- Validation, transformation, and TypeScript types using Zod.

This system replaces NX's environment files, aiding in configuring Nest modules for complex module trees.

## Basic Usage

Define a configuration and load function:

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

The `env` object provides:

```typescript
interface EnvLoader {
  required(envVariable: string, devFallback?: string): string
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T
  optional(envVariable: string, devFallback?: string): string | undefined
  optionalJSON<T = any>(envVariable: string, devFallback?: T): T | undefined
}
```

Behavior:

- `required` logs missing variables, uses `devFallback` in development, crashes in production.
- `optional` allows for defaults; use `env.optional('EMAIL') ?? 'island@island.is'`.
- `*JSON` parses JSON, validates with Zod, logs errors before crashing.

### Injecting Module Config

Inject using its key with strong typing via `ConfigType`.

```typescript
import { Inject } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { someModuleConfig } from './someModule.config'

export class SomeModuleService {
  constructor(
    @Inject(someModuleConfig.KEY)
    private config: ConfigType<typeof someModuleConfig>,
  ) {}
}
```

### Loading Configurations

Load configurations through the root module:

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { SomeModuleModule, someModuleConfig } from '@island.is/some/module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [someModuleConfig],
    }),
    SomeModuleModule,
  ],
})
export class SomeAppModule {}
```

### Validating Configuration

Use a Zod schema for validation.

```typescript
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const SomeModuleConfig = z.shape({
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

Validation errors stop the process with specific messages.

## Advanced Functionality

### Optional Config

Use `isConfigured` for optional dependencies and `registerOptional()` in module imports.

```typescript
import { Inject } from '@nestjs/common'
import { ConfigType, OtherConfig } from '@island.is/nest/config'
import { SomeModuleConfig } from './someModule.config'

export class SomeClientService {
  constructor(
    @Inject(SomeModuleConfig.Key)
    private config: ConfigType<typeof SomeModuleConfig>,
    @Inject(OtherConfig.Key)
    private otherConfig: ConfigType<typeof OtherConfig>,
  ) {}
}
```

In the module provisions:

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { SomeModuleConfig } from './someModule.config'
import { SomeClientService } from './someClient.service'

@Module({
  imports: [OtherConfig.registerOptional()],
  providers: [SomeClientService],
  exports: [SomeClientService],
})
export class SomeClientModule {}
```

### Server-Side Features

Use `serverSideFeature` to conditionally load modules.

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

### Dynamic Configuration

Support both global and dynamic configuration using a custom injection key.

```typescript
export const SomeModuleConfigKey = 'SomeModuleConfigKey'
```

Inject and register dynamically:

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

Import the module with:

```typescript
import { SomeModuleModule } from '@island.is/some/module'

@Module({
  imports: [
    SomeModuleModule.register({
      host: '',
      secret: '',
    }),
  ],
})
export class SomeAppModule {}
```

## Running Unit Tests

Run `nx test nest-config` with [Jest](https://jestjs.io).
