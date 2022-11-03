import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { apiProviders } from './apiProviders'
import { FiskistofaClientService } from './fiskistofaClient.service'

@Module({
  providers: [ApiConfiguration, FiskistofaClientService, ...apiProviders],
  exports: [FiskistofaClientService],
})
export class FiskistofaClientModule {}
