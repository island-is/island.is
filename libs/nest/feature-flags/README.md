# Nest Feature Flags

A Nest module which wraps our low level [feature flagging library](../../feature-flags/README.md) with some handy nest utilities.

## Setup

To use the FeatureFlag module you first need to load its configuration in your app module and make sure CONFIGCAT_SDK_KEY is set in your production environment.

```tsx
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

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

Then you can import it anywhere you need one of its exports:

```tsx
import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [FeatureFlagModule],
})
export class SomeModule {}
```

## FeatureFlagService

The service wraps getValue with support for our server-side [User objects](../../auth-nest-tools/README.md) for checking if they have access to a feature.

```tsx
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { User } from '@island.is/auth-nest-tools'

export class YourService {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  async maybeDoSomething(user: User) {
    const canDoSomething = await this.featureFlagService.getValue(
      Features.someFeature,
      false,
      user,
    )

    if (canDoIt) {
      return this.doSomething()
    }
  }
}
```

## FeatureFlagGuard

If your feature has new API endpoints, you can use the FeatureFlagGuard to disable them completely:

```tsx
import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Controller('some')
export class SomeController {
  @Get()
  @FeatureFlag(Features.someFeature)
  getSomething() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}
```

The guard works both for GraphQL resolvers as well as REST controllers. You can also feature flag an entire resolver or controller:

```tsx
import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@FeatureFlag(Features.someFeature)
@Controller('some')
export class SomeController {
  @Get()
  getSomething() {
    // Will only reach here if someFeature is turned on, either globally or for the authenticated user.
  }
}
```

{% hint style="warning" %}
The FeatureFlagGuard MUST be listed after IdsUserGuard in the `@UseGuards()` decorator if you want it to support user-specific feature flags.
{% endhint %}

## FeatureFlagClient

If you need access to the low level client and getValue functions, you can dependency inject it like this:

```tsx
import { Inject } from '@nestjs/common'
import {
  FeatureFlagClient,
  FEATURE_FLAG_CLIENT,
} from '@island.is/nest/feature-flags'

export class YourService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}
}
```

## Running unit tests

Run `nx test nest-feature-flags` to execute the unit tests via [Jest](https://jestjs.io).
