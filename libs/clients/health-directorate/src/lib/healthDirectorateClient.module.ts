import { Module } from '@nestjs/common'
import { exportedApis } from './clients/occupational-license/healthDirectorateClient.provider'
import { VaccinationsApiProvider } from './clients/vaccinations/vaccinations.provider'
import { HealthDirectorateClientService } from './clients/occupational-license/healthDirectorateClient.service'
import { HealthDirectorateVaccinationsService } from './clients/vaccinations/vaccinations.service'
import {
  HealthDirectorateHealthModule,
  HealthDirectorateHealthService,
} from './clients/health'

@Module({
  imports: [HealthDirectorateHealthModule],
  providers: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateHealthService,
    VaccinationsApiProvider,
    ...exportedApis,
  ],
  exports: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateHealthService,
  ],
})
export class HealthDirectorateClientModule {}
