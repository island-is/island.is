import { Module } from '@nestjs/common'
import { ApiConfig, ApiProviders } from './verdicts-client.provider'
import { VerdictsClientService } from './verdicts-client.service'

@Module({
  providers: [ApiConfig, ...ApiProviders, VerdictsClientService],
  exports: [VerdictsClientService],
})
export class VerdictsClientModule {}
