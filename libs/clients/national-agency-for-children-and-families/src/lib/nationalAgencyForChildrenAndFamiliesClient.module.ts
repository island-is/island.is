import { Module } from '@nestjs/common'
import { ExternalDropdownApi, ExternalNotificationApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'
import { apiProviders } from './apiProviders'

@Module({
  providers: [ApiConfiguration, ...apiProviders],
  exports: [ExternalDropdownApi, ExternalNotificationApi],
})
export class NationalAgencyForChildrenAndFamiliesClientModule {}
