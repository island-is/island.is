import { Module } from '@nestjs/common'

import { ApplicationEventResolver } from './applicationEvent.resolver'

@Module({
  providers: [ApplicationEventResolver],
})
export class ApplicationEventModule {}
