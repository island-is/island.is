import { Module } from '@nestjs/common'

import BackendService from './backend.service'

@Module({
  providers: [BackendService],
  exports: [BackendService],
})
export class BackendModule {}
