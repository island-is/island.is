import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AssetsClientModule } from '@island.is/clients/assets'
import { AssetsV2ClientModule } from '@island.is/clients/assets-v2'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { AssetsXRoadResolver } from './api-domains-assets.resolver'
import { AssetsXRoadService } from './api-domains-assets.service'

@Module({
  providers: [AssetsXRoadResolver, AssetsXRoadService],
  imports: [
    AssetsClientModule,
    AssetsV2ClientModule,
    FeatureFlagModule,
    AuthModule,
  ],
  exports: [AssetsXRoadService],
})
export class AssetsModule {}
