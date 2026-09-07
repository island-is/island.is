import { Module } from '@nestjs/common'

import { ConfirmJobSearchService } from './confirm-job-search.service'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [VmstUnemploymentClientModule],
  providers: [ConfirmJobSearchService],
  exports: [ConfirmJobSearchService],
})
export class ConfirmJobSearchModule {}
