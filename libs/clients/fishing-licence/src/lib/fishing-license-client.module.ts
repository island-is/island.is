import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import {
  FishingLicenceApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'

@Module({
  exports: exportedApis,
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenceApiClientMock },
    ...exportedApis,
  ],
})
export class FishingLicenseClientModule {}
