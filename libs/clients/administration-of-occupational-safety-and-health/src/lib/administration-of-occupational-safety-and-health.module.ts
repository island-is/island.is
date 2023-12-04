import { Module } from '@nestjs/common'
import { AdministrationOfOccupationalSafetyAndHealthClientService } from './administration-of-occupational-safety-and-health.service'
import { ApiProviders, ApiConfig } from './api.provider'

@Module({
  controllers: [],
  providers: [
    ApiConfig,
    AdministrationOfOccupationalSafetyAndHealthClientService,
    ...ApiProviders,
  ],
  exports: [AdministrationOfOccupationalSafetyAndHealthClientService],
})
export class AdministrationOfOccupationalSafetyAndHealthClientModule {}
