import { forwardRef, Module } from '@nestjs/common'

import { RepositoryModule } from '..'
import { ServiceInterruptionBannerController } from './serviceInterruptionBanner.controller'
import { ServiceInterruptionBannerService } from './serviceInterruptionBanner.service'

@Module({
  imports: [forwardRef(() => RepositoryModule)],
  controllers: [ServiceInterruptionBannerController],
  providers: [ServiceInterruptionBannerService],
  exports: [ServiceInterruptionBannerService],
})
export class ServiceInterruptionBannerModule {}
