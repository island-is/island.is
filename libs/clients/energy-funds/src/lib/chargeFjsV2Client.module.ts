import { Module } from '@nestjs/common'
import { IdsClientConfig } from '@island.is/nest/config'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { ChargeFjsV2ClientService } from './chargeFjsV2Client.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfiguration, ChargeFjsV2ClientService, ...exportedApis],
  exports: [ChargeFjsV2ClientService],
})
export class ChargeFjsV2ClientModule {}
