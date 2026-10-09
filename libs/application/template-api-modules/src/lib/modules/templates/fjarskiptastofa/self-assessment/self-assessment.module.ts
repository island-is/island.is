import { Module } from '@nestjs/common'

import { FjarskiptastofaSelfAssessmentClientModule } from '@island.is/clients/fjarskiptastofa/self-assessment'

import { SharedTemplateAPIModule } from '../../../shared'

import { FjarskiptastofaSelfAssessmentService } from './self-assessment.service'

@Module({
  imports: [SharedTemplateAPIModule, FjarskiptastofaSelfAssessmentClientModule],
  providers: [FjarskiptastofaSelfAssessmentService],
  exports: [FjarskiptastofaSelfAssessmentService],
})
export class FjarskiptastofaSelfAssessmentModule {}
