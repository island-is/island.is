import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import {
  FishingLicenseApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'

@Module({
  exports: exportedApis,
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenseApiClientMock },
    ApiConfiguration,
    ...exportedApis,
  ],
})
export class FishingLicenseClientModule {}
