import { Module } from '@nestjs/common'
import { ClientsUmsCostOfLivingCalculatorModule } from '@island.is/clients/ums-cost-of-living-calculator'
import { UmsCostOfLivingCalculatorResolver } from './umbodsmadur-skuldara.resolver'
@Module({
  controllers: [],
  providers: [UmsCostOfLivingCalculatorResolver],
  imports: [ClientsUmsCostOfLivingCalculatorModule],
})
export class UmbodsmadurSkuldaraModule {}
