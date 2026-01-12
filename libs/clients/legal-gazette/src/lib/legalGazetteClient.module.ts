import { Module } from '@nestjs/common'
import { LegalGazetteClientService } from './legalGazetteClient.service'
import { LegalGazetteClientProvider } from './legalGazetteClient.provider'

@Module({
  controllers: [],
  providers: [LegalGazetteClientProvider, LegalGazetteClientService],
  exports: [LegalGazetteClientService],
})
export class LegalGazetteClientModule {}
