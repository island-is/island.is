import { Module } from '@nestjs/common'
import { ApiProvider } from './apiProvider'
import { ElectronicRegistrationsClientService } from './electronicRegistrations.service'

@Module({
  providers: [ElectronicRegistrationsClientService, ApiProvider],
  exports: [ElectronicRegistrationsClientService],
})
export class ElectronicRegistrationsClientModule {}
