import { Module } from '@nestjs/common'
import { HuntingLicenseApiProvider } from './huntingLicenseClient.provider'
import { HuntingLicenseClientService } from './huntingLicenseClient.service'

@Module({
  providers: [HuntingLicenseApiProvider, HuntingLicenseClientService],
  exports: [HuntingLicenseClientService],
})
export class HuntingLicenseClientModule {}
