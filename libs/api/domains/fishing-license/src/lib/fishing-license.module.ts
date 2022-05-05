import { FishingLicenseClientModule } from '@island.is/clients/fishing-license'
import { Module } from '@nestjs/common'
import { FishingLicenseService } from './fishing-license.service'
import { FishingLicenseResolver } from '../graphql/fishing-license.resolver'

@Module({
  imports: [FishingLicenseClientModule],
  controllers: [],
  providers: [FishingLicenseService, FishingLicenseResolver],
})
export class FishingLicenseModule {}
