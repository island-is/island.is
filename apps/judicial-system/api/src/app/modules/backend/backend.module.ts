import { Global, Module } from '@nestjs/common'

import BackendService from './backend.service'

@Global()
@Module({
  providers: [BackendService],
  exports: [BackendService],
})
export class BackendModule {}
