import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LawAndOrderResolver } from './law-and-order.resolver'
import { LawAndOrderService } from './law-and-order.service'
import { JudicialSystemSPClientModule } from '@island.is/clients/judicial-system-sp'

@Module({
  imports: [JudicialSystemSPClientModule, AuthModule, FeatureFlagModule],
  providers: [LawAndOrderResolver, LawAndOrderService],
})
export class LawAndOrderModule {}
