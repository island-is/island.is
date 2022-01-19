import { Module } from '@nestjs/common'
import {
  FishingLicenceApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenceApiClientMock },
  ],
})
export class FishingLicenseClientModule {}
