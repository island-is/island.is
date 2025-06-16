import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { DistrictCommissionersLicensesClientModule } from '@island.is/clients/district-commissioners-licenses'
import { OccupationalLicensesResolver } from './occupationalLicenses.resolver'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { MMSClientModule } from '@island.is/clients/mms'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

@Module({
  imports: [
    CmsTranslationsModule,
    DistrictCommissionersLicensesClientModule,
    HealthDirectorateClientModule,
    MMSClientModule,
    FeatureFlagModule,
  ],
  providers: [OccupationalLicensesResolver, OccupationalLicensesService],
})
export class OccupationalLicensesModule {}
