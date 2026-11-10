import { Module } from '@nestjs/common'
import { FjarskiptastofaSelfAssessmentClientService } from './selfAssessment.service'
import { exportedApis } from './providers'

@Module({
  providers: [FjarskiptastofaSelfAssessmentClientService, ...exportedApis],
  exports: [FjarskiptastofaSelfAssessmentClientService],
})
export class FjarskiptastofaSelfAssessmentClientModule {}
