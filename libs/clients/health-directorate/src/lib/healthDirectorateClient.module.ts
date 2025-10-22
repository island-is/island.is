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
import { exportedLshDevApis } from './clients/lsh-dev/lsh-dev.provider'
import {
  HealthDirectorateHealthModule,
  HealthDirectorateHealthService,
} from './clients/health'

import { LshDevService } from './clients/lsh-dev/lsh-dev.service'
@Module({
  imports: [HealthDirectorateHealthModule],
  providers: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
    HealthDirectorateHealthService,
    LshDevService,
    OrganDonorApiProvider,
    OrganExceptionsApiProvider,
    VaccinationsApiProvider,

    ...exportedApis,
    ...exportedLshDevApis,
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
