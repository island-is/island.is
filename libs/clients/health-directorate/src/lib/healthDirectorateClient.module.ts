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

@Module({
  providers: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
    OrganDonorApiProvider,
    OrganExceptionsApiProvider,
    VaccinationsApiProvider,
    ...exportedApis,
  ],
  exports: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
  ],
})
export class HealthDirectorateClientModule {}
