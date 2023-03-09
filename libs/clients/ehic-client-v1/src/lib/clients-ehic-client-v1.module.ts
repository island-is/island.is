import { Module } from '@nestjs/common'
import { EuropeanHealthInsuranceCardClientService } from './europeanHealthInsuranceCardClient.service'

@Module({
  controllers: [],
  providers: [EuropeanHealthInsuranceCardClientService],
  exports: [EuropeanHealthInsuranceCardClientService],
})
export class ClientsEhicClientV1Client {}
