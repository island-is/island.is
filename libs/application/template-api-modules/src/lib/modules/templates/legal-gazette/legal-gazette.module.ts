import { Module } from '@nestjs/common'
import { LegalGazetteTemplateService } from './legal-gazette.service'
import { LegalGazetteClientModule } from '@island.is/clients/legal-gazette'

@Module({
  imports: [LegalGazetteClientModule],
  providers: [LegalGazetteTemplateService],
  exports: [LegalGazetteTemplateService],
})
export class LegalGazetteTemplateModule {}
