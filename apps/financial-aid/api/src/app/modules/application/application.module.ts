import { Module } from '@nestjs/common'

import { ApplicationResolver } from './application.resolver'
@Module({
  providers: [ApplicationResolver],
})
export class ApplicationModule {}
