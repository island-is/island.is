import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { GeneralFishingLicenseService } from './general-fishing-license.service'
import { FishingLicenseClientModule } from '@island.is/clients/fishing-license'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [SharedTemplateAPIModule, FishingLicenseClientModule, AwsModule,],
  providers: [GeneralFishingLicenseService],
  exports: [GeneralFishingLicenseService],
})
export class GeneralFishingLicenseModule {}
