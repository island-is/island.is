import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { apiProviders } from './apiProviders'
import { DataGatewayClientService } from './dataGatewayClient.service'

@Module({
  providers: [ApiConfiguration, ...apiProviders, DataGatewayClientService],
  exports: [DataGatewayClientService],
})
export class DataGatewayClientModule {}
