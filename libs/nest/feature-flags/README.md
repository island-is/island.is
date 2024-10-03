```tsx
# Nest Feature Flags

A Nest module that wraps our low-level [feature flagging library](../../feature-flags/README.md) with useful Nest utilities.

## Setup

To use the `FeatureFlagModule`, you first need to load its configuration in your app module and ensure that `CONFIGCAT_SDK_KEY` is set in your production environment.

```tsx
import { Module } from '@nestjs/common';
import { ConfigModule } from '@island.is/nest/config';
import { FeatureFlagConfig } from '@island.is/nest/feature-flags';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FeatureFlagConfig],
    }),
  ],
})
export class AppModule {}
```

You can then import it wherever you need one of its exports:

```tsx
import { Module } from '@nestjs/common';
import { FeatureFlagModule } from '@island.is/nest/feature-flags';

@Module({
  imports: [FeatureFlagModule],
})
export class SomeModule {}
```

## FeatureFlagService

This service wraps `getValue` with support for our server-side [User objects](../../auth-nest-tools/README.md) to check if they have access to a feature.

```tsx
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags';
import { User } from '@island.is/auth-nest-tools';

export class YourService {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  async maybeDoSomething(user: User) {
    const canDoSomething = await this.featureFlagService.getValue(
      Features.someFeature,
      false,
      user,
    );

    if (canDoSomething) {
      return this.doSomething();
    }
  }
}
```

## FeatureFlagGuard

If your feature introduces new API endpoints, you can use the `FeatureFlagGuard` to disable them completely:

```tsx
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags';

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Controller('some')
export class SomeController {
  @Get()
  @FeatureFlag(Features.someFeature)
  getSomething() {
    // This will only be reached if `someFeature` is enabled, either globally or for the authenticated user.
  }
}
```

The guard is compatible with both GraphQL resolvers and REST controllers. You can also apply feature flagging to an entire resolver or controller:

```tsx
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags';

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@FeatureFlag(Features.someFeature)
@Controller('some')
export class SomeController {
  @Get()
  getSomething() {
    // This will only be reached if `someFeature` is enabled, either globally or for the authenticated user.
  }
}
```

> **Warning:**  
> The `FeatureFlagGuard` **must** be listed after `IdsUserGuard` in the `@UseGuards()` decorator if you want it to support user-specific feature flags.

## FeatureFlagClient

If you need access to the low-level client and `getValue` functions, you can inject it as a dependency:

```tsx
import { Inject } from '@nestjs/common';
import {
  FeatureFlagClient,
  FEATURE_FLAG_CLIENT,
} from '@island.is/nest/feature-flags';

export class YourService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}
}
```

## Running Unit Tests

Run `nx test nest-feature-flags` to execute the unit tests using [Jest](https://jestjs.io).
```