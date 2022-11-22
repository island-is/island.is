import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AssetsV2ClientModule } from '@island.is/clients/assets-v2'

import { AssetsXRoadResolver } from './api-domains-assets.resolver'
import { AssetsXRoadService } from './api-domains-assets.service'

@Module({
  providers: [AssetsXRoadResolver, AssetsXRoadService],
  imports: [AssetsV2ClientModule, AuthModule],
  exports: [AssetsXRoadService],
})
export class AssetsModule {}
