import { Module } from '@nestjs/common'
import {
  FishingLicenceApiClientMock,
  FISHING_LICENSE_CLIENT,
} from './fishing-license-client.mock'
import { SkipApiProvider } from './SkipApiProvider'
import { UmsoknirApiProvider } from './UmsoknirApiProvider'
import { UtgerdirApiProvider } from './UtgerdirApiProvider'

@Module({
  exports: [SkipApiProvider, UmsoknirApiProvider, UtgerdirApiProvider],
  providers: [
    { provide: FISHING_LICENSE_CLIENT, useClass: FishingLicenceApiClientMock },
    SkipApiProvider,
    UmsoknirApiProvider,
    UtgerdirApiProvider,
  ],
})
export class FishingLicenseClientModule {}
