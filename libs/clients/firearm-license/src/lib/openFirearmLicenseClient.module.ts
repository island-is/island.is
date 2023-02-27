import { Module } from '@nestjs/common'
import { OpenFirearmLicenseApiProvider } from './openFirearmApiProvider'
import { OpenFirearmApi } from './openFirearmApi.services'

@Module({
  providers: [OpenFirearmApi, OpenFirearmLicenseApiProvider],
  exports: [OpenFirearmApi],
})
export class OpenFirearmLicenseClientModule {}
