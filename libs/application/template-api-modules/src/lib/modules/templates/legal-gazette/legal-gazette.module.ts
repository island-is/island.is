import { Module } from '@nestjs/common'
import { LegalGazetteTemplateService } from './legal-gazette.service'
import { SharedTemplateAPIModule } from '../../shared'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [LegalGazetteTemplateService],
  exports: [LegalGazetteTemplateService],
})
export class LegalGazetteTemplateModule {}
