import { Module } from '@nestjs/common'
import { FirearmApi } from './services/firearmApi.services'
import { OpenFirearmApi } from './services/openFirearmApi.services'
import { FirearmApiProvider } from './providers/firearmApiProvider'
import { OpenFirearmApiProvider } from './providers/openFirearmApiProvider'

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
