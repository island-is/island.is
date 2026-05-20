import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { EstatesClientModule } from '@island.is/clients/estates'
import { EstatesResolver } from './estates.resolver'
import { EstatesDomainService } from './estates.service'

@Module({
  imports: [EstatesClientModule, FeatureFlagModule],
  providers: [EstatesResolver, EstatesDomainService],
})
export class EstatesModule {}
