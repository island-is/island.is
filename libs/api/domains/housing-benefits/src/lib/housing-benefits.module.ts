import { Module } from '@nestjs/common'
import { HmsHousingBenefitsClientModule } from '@island.is/clients/hms-housing-benefits'
import { HousingBenefitsResolver } from './housing-benefits.resolver'

@Module({
  imports: [HmsHousingBenefitsClientModule],
  providers: [HousingBenefitsResolver],
})
export class HousingBenefitsModule {}
