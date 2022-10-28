import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { HMSClientModule } from '@island.is/clients/hms'

import { AssetsXRoadResolver } from './api-domains-assets.resolver'
import { AssetsXRoadService } from './api-domains-assets.service'

@Module({
  providers: [AssetsXRoadResolver, AssetsXRoadService],
  imports: [HMSClientModule, AuthModule],
  exports: [AssetsXRoadService],
})
export class AssetsModule {}
