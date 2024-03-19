import { Module } from '@nestjs/common'
import { HmsLoansApiProvider } from './hms-housing-benefits.provider'

@Module({
  providers: [HmsLoansApiProvider],
  exports: [HmsLoansApiProvider],
})
export class HmsHousingBenefitsClientModule {}
