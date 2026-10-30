import { Module } from '@nestjs/common'

import BackendAPI from './backend'

@Module({
  providers: [BackendAPI],
  exports: [BackendAPI],
})
export class BackendModule {}
