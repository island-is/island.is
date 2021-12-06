import { Inject, Module } from '@nestjs/common'
import type { FeatureFlagClient } from '@island.is/feature-flags'

import {
  FEATURE_FLAG_CLIENT,
  FeatureFlagClientProvider,
} from './feature-flag.client'
import { FeatureFlagService } from './feature-flag.service'

@Module({
  controllers: [],
  providers: [FeatureFlagClientProvider, FeatureFlagService],
  exports: [FeatureFlagClientProvider, FeatureFlagService],
})
export class FeatureFlagModule {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  onApplicationShutdown() {
    this.client.dispose()
  }
}
