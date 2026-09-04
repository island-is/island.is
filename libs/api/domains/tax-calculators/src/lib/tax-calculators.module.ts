import { Module } from '@nestjs/common'
import { TaxCalculatorsResolver } from './tax-calculators.resolver'
import { TaxCalculatorsService } from './tax-calculators.service'

@Module({
  providers: [TaxCalculatorsResolver, TaxCalculatorsService],
})
export class TaxCalculatorsModule {}
