import { Module } from '@nestjs/common'
import { WorkAccidentClientService } from './workAccident.service'
import { exportedApis } from './providers'

@Module({
  providers: [WorkAccidentClientService, ...exportedApis],
  exports: [WorkAccidentClientService],
})
export class WorkAccidentClientModule {}
