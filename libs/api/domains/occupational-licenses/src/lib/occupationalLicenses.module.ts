import { OccupationalLicensesClientModule } from '@island.is/clients/occupational-licenses'
import { Module } from '@nestjs/common'
import { OccupationalLicensesResolver } from './occupationalLicenses.resolver'

@Module({
  imports: [OccupationalLicensesClientModule],
  providers: [OccupationalLicensesResolver],
})
export class OccupationalLicensesModule {}
