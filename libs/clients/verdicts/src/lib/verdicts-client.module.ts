import { Module } from '@nestjs/common'
import {
  GoProApiConfig,
  SupremeCourtApiConfig,
  GoProApiProviders,
  SupremeCourtApiProviders,
} from './verdicts-client.provider'
import { VerdictsClientService } from './verdicts-client.service'

@Module({
  providers: [
    GoProApiConfig,
    SupremeCourtApiConfig,
    ...GoProApiProviders,
    ...SupremeCourtApiProviders,
    VerdictsClientService,
  ],
  exports: [VerdictsClientService],
})
export class VerdictsClientModule {}
