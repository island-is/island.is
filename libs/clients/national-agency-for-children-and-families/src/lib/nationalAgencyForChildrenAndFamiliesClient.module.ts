import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { apiProviders } from './apiProviders'
import { NationalAgencyForChildrenAndFamiliesClientService } from './nationalAgencyForChildrenAndFamiliesClient.service'

@Module({
  providers: [
    ApiConfiguration,
    ...apiProviders,
    NationalAgencyForChildrenAndFamiliesClientService,
  ],
  exports: [NationalAgencyForChildrenAndFamiliesClientService],
})
export class NationalAgencyForChildrenAndFamiliesClientModule {}
