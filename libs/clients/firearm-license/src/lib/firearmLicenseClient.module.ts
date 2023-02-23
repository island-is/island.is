import { Module } from '@nestjs/common'
import { FirearmLicenseApiProvider } from './firearmApiProvider'
import { OpenFirearmLicenseApiProvider } from './openFirearmApiProvider'

@Module({
  providers: [FirearmLicenseApiProvider, OpenFirearmLicenseApiProvider],
  exports: [FirearmLicenseApiProvider, OpenFirearmLicenseApiProvider],
})
export class FirearmLicenseClientModule {}
