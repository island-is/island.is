import { Module } from '@nestjs/common'
import { CalculatorsClientModule } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorsResolver } from './tax-calculators.resolver'
import { TaxCalculatorsService } from './tax-calculators.service'

@Module({
  imports: [CalculatorsClientModule],
  providers: [TaxCalculatorsResolver, TaxCalculatorsService],
})
export class TaxCalculatorsModule {}
