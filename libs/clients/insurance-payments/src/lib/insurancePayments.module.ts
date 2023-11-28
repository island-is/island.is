import { Module } from '@nestjs/common'
import { InsurancePaymentsApiProvider } from './insurancePayments.provider'

@Module({
  providers: [InsurancePaymentsApiProvider],
  exports: [InsurancePaymentsApiProvider],
})
export class InsurancePaymentsClientModule {}
