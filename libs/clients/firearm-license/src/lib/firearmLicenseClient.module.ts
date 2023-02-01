import { Module } from '@nestjs/common'
import { FirearmLicenseApiProvider } from './firearmApiProvider'
import { OpenFirearmLicenseApiProvider } from './openFirearmApiProvider'
import { FirearmApi } from './firearmApi.services'
import { OpenFirearmApi } from './openFirearmApi.services'

@Module({
  providers: [
    FirearmLicenseApiProvider,
    OpenFirearmLicenseApiProvider,
    FirearmApi,
    OpenFirearmApi,
  ],
  exports: [FirearmApi, OpenFirearmApi],
})
export class FirearmLicenseClientModule {}
