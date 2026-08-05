import { Module } from '@nestjs/common'
import { CustomsCalculatorClientModule } from '@island.is/clients-rsk-customs-calculator'
import { CustomsCalculatorResolver } from './customsCalculator.resolver'
import { CustomsCalculatorService } from './customsCalculator.service'

@Module({
  imports: [CustomsCalculatorClientModule],
  providers: [CustomsCalculatorResolver, CustomsCalculatorService],
})
export class ApiDomainsCustomsCalculatorModule {}
