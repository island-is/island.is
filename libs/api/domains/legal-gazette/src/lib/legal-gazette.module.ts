import { Module } from '@nestjs/common'

import { LegalGazetteResolver } from './legal-gazette.resolver'
import { LegalGazetteService } from './legal-gazette.service'

import { LegalGazetteClientModule } from '@island.is/clients/legal-gazette'

@Module({
  imports: [LegalGazetteClientModule],
  controllers: [],
  providers: [LegalGazetteService, LegalGazetteResolver],
  exports: [LegalGazetteService],
})
export class LegalGazetteModule {}
