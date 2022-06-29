import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { ChargeFjsV2ClientService } from './chargeFjsV2Client.service'

@Module({
  providers: [ApiConfiguration, ChargeFjsV2ClientService, ...exportedApis],
  exports: [ChargeFjsV2ClientService],
})
export class ChargeFjsV2ClientModule {}
