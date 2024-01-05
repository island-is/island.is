import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { Module } from '@nestjs/common'
import { OccupationalLicensesResolver } from './occupationalLicenses.resolver'
import { MMSClientModule } from '@island.is/clients/mms'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [HealthDirectorateClientModule, MMSClientModule, FeatureFlagModule],
  providers: [OccupationalLicensesResolver, OccupationalLicensesService],
})
export class OccupationalLicensesModule {}
