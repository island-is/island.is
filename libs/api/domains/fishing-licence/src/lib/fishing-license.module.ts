import {
  FishingLicenceApiClientMock,
  FishingLicenseClientModule,
  FISHING_LICENSE_CLIENT,
} from '@island.is/clients/fishing-licence'
import { Module } from '@nestjs/common'
import { FishingLicenseService } from './fishing-license.service'
import { FishingLicenseResolver } from '../graphql/fishing-license.resolver'

@Module({
  imports: [FishingLicenseClientModule],
  controllers: [],
  providers: [
    FishingLicenseService,
    FishingLicenseResolver,
    {
      provide: FISHING_LICENSE_CLIENT,
      useClass: FishingLicenceApiClientMock,
    },
  ],
})
export class FishingLicenseModule {}
