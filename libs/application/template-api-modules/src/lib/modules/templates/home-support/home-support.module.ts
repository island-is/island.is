import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { HomeSupportService } from './home-support.service'
import { ArborgWorkpointModule } from '@island.is/clients/workpoint/arborg'

@Module({
  imports: [SharedTemplateAPIModule, ArborgWorkpointModule],
  providers: [HomeSupportService],
  exports: [HomeSupportService],
})
export class HomeSupportModule {}
