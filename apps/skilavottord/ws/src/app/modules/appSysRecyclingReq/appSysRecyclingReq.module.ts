import { Module } from '@nestjs/common'
import { AppSysRecyclingReqService } from './appSysRecyclingReq.service'
import { AppSysRecyclingReqResolver } from './appSysRecyclingReq.resolver'

@Module({
  imports: [],
  providers: [AppSysRecyclingReqResolver, AppSysRecyclingReqService],
  exports: [AppSysRecyclingReqService],
})
export class AppSysRecyclingReqModule {}
