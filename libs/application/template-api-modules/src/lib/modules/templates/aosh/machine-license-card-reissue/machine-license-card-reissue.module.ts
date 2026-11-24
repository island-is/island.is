import { Module } from '@nestjs/common'
import { SeminarsClientModule } from '@island.is/clients/seminars-ver'
import { SharedTemplateAPIModule } from '../../../shared'
import { MachineLicenseCardReissueTemplateService } from './machine-license-card-reissue.service'

@Module({
  imports: [SharedTemplateAPIModule, SeminarsClientModule],
  providers: [MachineLicenseCardReissueTemplateService],
  exports: [MachineLicenseCardReissueTemplateService],
})
export class MachineLicenseCardReissueTemplateModule {}
