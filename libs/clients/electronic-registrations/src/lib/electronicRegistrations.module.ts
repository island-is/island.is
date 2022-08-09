import { Module } from '@nestjs/common'
import { ElectronicRegistrationsClientService } from './electronicRegistrations.service'

@Module({
  providers: [ElectronicRegistrationsClientService],
  exports: [ElectronicRegistrationsClientService],
})
export class ElectronicRegistrationsModule {}
