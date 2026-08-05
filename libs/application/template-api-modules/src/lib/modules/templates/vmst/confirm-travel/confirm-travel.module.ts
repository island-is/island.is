import { Module } from '@nestjs/common'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { ConfirmTravelService } from './confirm-travel.service'
@Module({
  imports: [VmstUnemploymentClientModule],
  providers: [ConfirmTravelService],
  exports: [ConfirmTravelService],
})
export class ConfirmTravelModule {}
