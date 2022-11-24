import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AssetsClientModule } from '@island.is/clients/assets'

import { AssetsXRoadResolver } from './api-domains-assets.resolver'
import { AssetsXRoadService } from './api-domains-assets.service'

@Module({
  providers: [AssetsXRoadResolver, AssetsXRoadService],
  imports: [AssetsClientModule, AuthModule],
  exports: [AssetsXRoadService],
})
export class AssetsModule {}
