import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PSignSubmissionService } from './p-sign-submission.service'
import { SharedTemplateAPIModule } from '../../shared'

@Module({
  imports: [SyslumennClientModule, SharedTemplateAPIModule],
  providers: [PSignSubmissionService],
  exports: [PSignSubmissionService],
})
export class PSignSubmissionModule {}
