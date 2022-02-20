import { Module } from '@nestjs/common'
import { ApplicationModule } from '@island.is/application/nest/application'
import { AwsModule } from '@island.is/nest/aws'
import { LoggingModule } from '@island.is/logging'
import { ApplicationLifeCycleService } from './application-lifecycle.service'

@Module({
  imports: [ApplicationModule, AwsModule, LoggingModule],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
