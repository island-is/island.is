import { Module } from '@nestjs/common'
import { FeatureFlagClientProvider } from './feature-flag.client'
import { FeatureFlagService } from './feature-flag.service'

@Module({
  controllers: [],
  providers: [FeatureFlagClientProvider, FeatureFlagService],
  exports: [FeatureFlagClientProvider, FeatureFlagService],
})
export class FeatureFlagModule {}
