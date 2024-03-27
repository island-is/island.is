import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { DistrictCommissionersLicensesClientModule } from '@island.is/clients/district-commissioners-licenses'
import { OccupationalLicensesV2Resolver } from './occupationalLicensesV2.resolver'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { MMSClientModule } from '@island.is/clients/mms'
import { OccupationalLicensesV2Service } from './occupationalLicensesV2.service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

@Module({
  imports: [
    DistrictCommissionersLicensesClientModule,
    HealthDirectorateClientModule,
    MMSClientModule,
    CmsTranslationsModule,
    FeatureFlagModule,
  ],
  providers: [OccupationalLicensesV2Resolver, OccupationalLicensesV2Service],
})
export class OccupationalLicensesV2Module {}
