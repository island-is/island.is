import { Module } from '@nestjs/common'
import { OccupationalLicensesV2Resolver } from './occupationalLicenses.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { DistrictCommissionersLicensesClientModule } from '@island.is/clients/district-commissioners-licenses'

@Module({
  imports: [DistrictCommissionersLicensesClientModule, FeatureFlagModule],
  providers: [OccupationalLicensesV2Resolver],
})
export class OccupationalLicensesV2Module {}
