import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
// import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  imports: [
    SharedTemplateAPIModule,
    // CriminalRecordModule,
    SyslumennClientModule,
  ],
  providers: [CriminalRecordSubmissionService],
  exports: [CriminalRecordSubmissionService],
})
export class CriminalRecordSubmissionModule {}
