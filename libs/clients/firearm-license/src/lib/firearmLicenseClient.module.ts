import { Module } from '@nestjs/common'
import { FirearmApi } from './firearmApi.services'
import { OpenFirearmApi } from './openFirearmApi.services'
import { FirearmApiProvider } from './firearmApiProvider'
import { OpenFirearmApiProvider } from './openFirearmApiProvider'

@Module({
  providers: [OpenFirearmApi, OpenFirearmApiProvider],
  exports: [OpenFirearmApi],
})
export class FirearmLicenseUpdateClientModule {}

@Module({
  providers: [FirearmApi, FirearmApiProvider],
  exports: [FirearmApi],
})
export class FirearmLicenseClientModule {}
