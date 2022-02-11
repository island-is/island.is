import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import {
  FishingLicenceApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'

@Module({
  exports: exportedApis,
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenceApiClientMock },
    ApiConfiguration,
    ...exportedApis,
  ],
})
export class FishingLicenseClientModule {}
