import { Module } from '@nestjs/common'
import { FirearmLicenseApiProvider } from './firearmApiProvider'
import { FirearmApi } from './firearmApi.services'

@Module({
  providers: [FirearmApi, FirearmLicenseApiProvider],
  exports: [FirearmApi],
})
export class FirearmLicenseClientModule {}
