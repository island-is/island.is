import { Module } from '@nestjs/common'
import {
  FishingLicenseApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenseApiClientMock },
  ],
})
export class FishingLicenseClientModule {}
