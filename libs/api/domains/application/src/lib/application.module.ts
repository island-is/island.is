import { Module } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
import { ApplicationService } from './application.service'

@Module({
  providers: [ApplicationResolver, ApplicationService],
})
export class ApplicationModule {}
