import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { GeneralFishingLicenseService } from './general-fishing-license.service'
import { FishingLicenseClientModule } from '@island.is/clients/fishing-license'

@Module({
  imports: [SharedTemplateAPIModule, FishingLicenseClientModule],
  providers: [GeneralFishingLicenseService],
  exports: [GeneralFishingLicenseService],
})
export class GeneralFishingLicenseModule {}
