```markdown
# Nest Config

This module extends Nest's [Configuration](https://docs.nestjs.com/techniques/configuration) to provide additional functionality:

- Validation of required environment variables.
- Support for fallback values for local development.
- Compatibility with Server-Side Feature Flags.
- Helpers for JSON-encoded environment variables.
- Integration with Zod for validation, transformation, and TypeScript typing.

This configuration system is designed to replace NX's environment files for configuring Nest modules within APIs, especially beneficial for larger module trees.

## Basic Usage

Begin by defining a configuration and a load function.

```ts
import { defineConfig } from '@island.is/nest/config';

export const someModuleConfig = defineConfig({
  name: 'SomeModule',
  load: (env) => ({
    url: env.required('SOME_MODULE_URL', 'http://localhost:3000'),
    secret: env.required('SOME_MODULE_SECRET'),
    ttl: env.optionalJSON('SOME_MODULE_TTL') ?? 60,
  }),
});
```

These configurations should ideally mirror config blocks in our [Helm DSL](https://github.com/island-is/infrastructure/issues/918).

The `env` object provides helpers for reading environment values with specific behavior based on the environment context.

### Injecting Module Config

After defining the config, inject it into services using its key for a strongly typed configuration object.

```ts
import { Inject } from '@nestjs/common';
import { ConfigType } from '@island.is/nest/config';
import { someModuleConfig } from './someModule.config';

export class SomeModuleService {
  constructor(
    @Inject(someModuleConfig.KEY)
    private config: ConfigType<typeof someModuleConfig>,
  ) {
    config.isConfigured; // boolean
    config.url; // string
    config.secret; // string
    config.ttl; // number
  }
}
```

### Loading a Module and Its Configuration

Configuration is loaded through the root module, as with NestJS's Config module.

```ts
import { ConfigModule } from '@island.is/nest/config';
import { SomeModuleModule, someModuleConfig } from '@island.is/some/module';

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

If a module is imported without its configuration, NestJS will stop the process, displaying an error message specifying the missing configuration.

### Validating Configuration

Besides validating missing variables, you can provide a Zod schema for validation of the final object.

```ts
import { defineConfig } from '@island.is/nest/config';
import { z } from 'zod';

const SomeModuleConfig = z.object({
  url: z.string().url(),
  secret: z.string(),
  ttl: z.number().int().optional(),
});

export const someModuleConfig = defineConfig({
  name: 'SomeModule',
  schema: SomeModuleConfig,
  load: (env) => ({
    url: env.required('SOME_MODULE_URL', 'http://localhost:3000'),
    secret: env.required('SOME_MODULE_SECRET'),
    ttl: env.optionalJSON('SOME_MODULE_TTL') ?? 60,
  }),
});
```

## Advanced Functionality

### Optional Config

Modules with optional dependencies can check the `isConfigured` property. Optional configurations should be loaded in their respective modules using `registerOptional()`.

```ts
import { Inject } from '@nestjs/common';
import { ConfigType, OtherConfig } from '@island.is/nest/config';
import { SomeModuleConfig } from './someModule.config';

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

### Server Side Features

Use Server-Side Feature Flags to disable functionality not meant for production. Dependencies use the `serverSideFeature` attribute to handle potentially missing configurations.

### Supporting Dynamic Configuration

Support both global and dynamic configuration using custom injection keys.

```ts
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

Dynamic configuration can be loaded via the `register` function.

## Running Unit Tests

Run `nx test nest-config` to execute the unit tests using [Jest](https://jestjs.io).
```