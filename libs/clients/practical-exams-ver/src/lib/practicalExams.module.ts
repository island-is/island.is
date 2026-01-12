import { Module } from '@nestjs/common'
import { PracticalExamsClientService } from './practicalExams.service'
import { exportedApis } from './providers'

@Module({
  providers: [PracticalExamsClientService, ...exportedApis],
  exports: [PracticalExamsClientService],
})
export class PracticalExamsClientModule {}
