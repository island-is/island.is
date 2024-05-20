import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LawAndOrderResolver } from './law-and-order.resolver'
import { LawAndOrderService } from './law-and-order.service'
import { LawAndOrderClientModule } from '@island.is/clients/law-and-order'

@Module({
  imports: [LawAndOrderClientModule, AuthModule, FeatureFlagModule],
  providers: [LawAndOrderClientModule, LawAndOrderResolver, LawAndOrderService],
})
export class LawAndOrderModule {}
