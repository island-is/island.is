import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { JudicialSystemSPClientModule } from '@island.is/clients/judicial-system-sp'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { PoliceCasesClientModule } from '@island.is/clients/police-cases'
import { LawAndOrderResolver } from './resolvers/law-and-order.resolver'
import { LawAndOrderService } from './services/law-and-order.service'
import { PoliceCasesService } from './services/police-cases.service'
import { PoliceCasesResolver } from './resolvers/police-cases.resolver'

@Module({
  imports: [
    JudicialSystemSPClientModule,
    PoliceCasesClientModule,
    AuthModule,
    FeatureFlagModule,
    CmsTranslationsModule,
  ],
  providers: [
    LawAndOrderResolver,
    PoliceCasesService,
    PoliceCasesResolver,
    LawAndOrderService,
  ],
})
export class LawAndOrderModule {}
