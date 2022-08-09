import { Module } from '@nestjs/common'
import { ElectronicRegistrationsResolver } from './electronicRegistrations.resolver'
import { ElectronicRegistrationsClientModule } from '@island.is/clients/electronic-registrations'

@Module({
  imports: [ElectronicRegistrationsClientModule],
  providers: [ElectronicRegistrationsResolver],
})
export class ElectronicRegistrationsModule {}
