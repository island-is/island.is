import { CacheModule, Module } from '@nestjs/common'
import { DrivingLicenseApiClientService } from './drivingLicenseApiClient.service'
import { PkPassClient } from './pkpass/pkpass.client'

@Module({
  imports: [CacheModule.register()],
  providers: [PkPassClient, DrivingLicenseApiClientService],
  exports: [DrivingLicenseApiClientService],
})
export class DrivingLicenseApiClientModule {}
