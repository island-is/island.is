import { Module } from '@nestjs/common'

import { ServiceInterruptionBannerResolver } from './serviceInterruptionBanner.resolver'

@Module({
  providers: [ServiceInterruptionBannerResolver],
})
export class ServiceInterruptionBannerModule {}
