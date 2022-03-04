import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import { LoggingModule } from '@island.is/logging'
import { ApplicationLifeCycleService } from './application-lifecycle.service'

@Module({
  imports: [ApplicationApiCoreModule, AwsModule, LoggingModule],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
