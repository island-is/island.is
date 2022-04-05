import { Module } from '@nestjs/common'

import { CourtClientService } from './courtClient.service'

@Module({
  providers: [CourtClientService],
  exports: [CourtClientService],
})
export class CourtClientModule {}
