import { Module } from '@nestjs/common'
import { exportedApis } from './clients/occupational-license/healthDirectorateClient.provider'
import { exportedApis as vaccinationsApis } from './clients/vaccinations/vaccinations.provider'
import { exportedApis as organDonationsApis } from './clients/organ-donation/organDonation.provider'
import { HealthDirectorateClientService } from './clients/occupational-license/healthDirectorateClient.service'
import { HealthDirectorateVaccinationsService } from './clients/vaccinations/vaccinations.service'
import { HealthDirectorateOrganDonationService } from './clients/organ-donation/organDonation.service'

@Module({
  providers: [
    ...exportedApis,
    ...vaccinationsApis,
    ...organDonationsApis,
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
  ],
  exports: [
    HealthDirectorateClientService,
    HealthDirectorateVaccinationsService,
    HealthDirectorateOrganDonationService,
  ],
})
export class HealthDirectorateClientModule {}
