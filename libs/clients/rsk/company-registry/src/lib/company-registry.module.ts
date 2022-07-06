import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { CompanyRegistryClientService } from './company-registry-client.service'

@Module({
  providers: [ApiConfiguration, CompanyRegistryClientService, ...exportedApis],
  exports: [CompanyRegistryClientService],
})
export class CompanyRegistryClientModule {}
