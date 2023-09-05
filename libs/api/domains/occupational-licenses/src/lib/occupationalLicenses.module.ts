import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { Module } from '@nestjs/common'
import { OccupationalLicensesResolver } from './occupationalLicenses.resolver'
import { MMSClientModule } from '@island.is/clients/mms'
import { OccupationalLicensesService } from './occupationalLicenses.service'

@Module({
  imports: [HealthDirectorateClientModule, MMSClientModule],
  providers: [OccupationalLicensesResolver, OccupationalLicensesService],
})
export class OccupationalLicensesModule {}
