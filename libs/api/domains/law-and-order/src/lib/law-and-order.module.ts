import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { JudicialSystemSPClientModule } from '@island.is/clients/judicial-system-sp'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LawAndOrderResolver } from './law-and-order.resolver'
import { LawAndOrderService } from './law-and-order.service'

@Module({
  imports: [
    JudicialSystemSPClientModule,
    AuthModule,
    FeatureFlagModule,
    CmsTranslationsModule,
  ],
  providers: [LawAndOrderResolver, LawAndOrderService],
})
export class LawAndOrderModule {}
