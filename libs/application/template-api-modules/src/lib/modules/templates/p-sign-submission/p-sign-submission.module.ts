import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PSignSubmissionService } from './p-sign-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [SyslumennClientModule, SharedTemplateAPIModule, AwsModule],
  providers: [PSignSubmissionService],
  exports: [PSignSubmissionService],
})
export class PSignSubmissionModule {}
