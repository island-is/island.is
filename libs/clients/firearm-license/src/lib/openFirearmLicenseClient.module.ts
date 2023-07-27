import { Module } from '@nestjs/common'
import { OpenFirearmLicenseApiProvider } from './openFirearmApiProvider'

@Module({
  providers: [OpenFirearmLicenseApiProvider],
  exports: [OpenFirearmLicenseApiProvider],
})
export class OpenFirearmLicenseClientModule {}
