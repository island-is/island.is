import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import { LoggingModule } from '@island.is/logging'
import { ApplicationLifeCycleService } from './application-lifecycle.service'
import { ApplicationChargeModule } from '../charge/application-charge.module'

@Module({
  imports: [
    ApplicationApiCoreModule,
    AwsModule,
    LoggingModule,
    ApplicationChargeModule,
  ],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
