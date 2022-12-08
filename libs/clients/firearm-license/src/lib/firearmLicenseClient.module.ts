import { Module } from '@nestjs/common'
import { FirearmLicenseApiProvider } from './firearmApiProvider'

@Module({
  providers: [FirearmLicenseApiProvider],
  exports: [FirearmLicenseApiProvider],
})
export class FirearmLicenseClientModule {}
