import { Module } from '@nestjs/common'
import { IcelandicHealthInsuranceApiProvider } from './clients-icelandic-health-insurance.config.service'

@Module({
  providers: [IcelandicHealthInsuranceApiProvider],
  exports: [IcelandicHealthInsuranceApiProvider],
})
export class IcelandicHealthInsuranceClientModule {}
