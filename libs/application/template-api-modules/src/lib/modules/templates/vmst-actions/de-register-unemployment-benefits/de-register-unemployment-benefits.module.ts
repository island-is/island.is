import { Module } from '@nestjs/common'
import { DeRegisterUnemploymentBenefitsService } from './de-register-unemployment-benefits.service'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [VmstUnemploymentClientModule],
  providers: [DeRegisterUnemploymentBenefitsService],
  exports: [DeRegisterUnemploymentBenefitsService],
})
export class DeRegisterUnemploymentBenefitsModule {}
