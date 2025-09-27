import { Module } from '@nestjs/common'
import { exportedApis } from './clients/occupational-license/healthDirectorateClient.provider'
import { VaccinationsApiProvider } from './clients/vaccinations/vaccinations.provider'
import {
  OrganDonorApiProvider,
  OrganExceptionsApiProvider,
} from './clients/organ-donation/organDonation.provider'
import { HealthDirectorateClientService } from './clients/occupational-license/healthDirectorateClient.service'
import { HealthDirectorateVaccinationsService } from './clients/vaccinations/vaccinations.service'
import { HealthDirectorateOrganDonationService } from './clients/organ-donation/organDonation.service'
import { HealthDirectorateHealthService } from './clients/health'
import {
  exportedHealthApis,
  sharedApiConfig,
} from './clients/health/health.provider'
import {
  LshDevApiConfiguration,
  exportedLshDevApis,
} from './clients/lsh-dev/lsh-dev.provider'
import { LshDevService } from './clients/lsh-dev/lsh-dev.service'

@Module({
  providers: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
    HealthDirectorateHealthService,
    LshDevService,
    OrganDonorApiProvider,
    OrganExceptionsApiProvider,
    VaccinationsApiProvider,
    ...exportedHealthApis,
    ...exportedApis,
    ...exportedLshDevApis,
    LshDevApiConfiguration,
    sharedApiConfig,
  ],
  exports: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
    HealthDirectorateHealthService,
    LshDevService,
  ],
})
export class HealthDirectorateClientModule {}
