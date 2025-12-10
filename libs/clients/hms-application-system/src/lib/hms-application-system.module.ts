import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { ApiConfiguration } from './apiConfiguration'
import { HmsApplicationSystemConfig } from './hms-application-system.config'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    ConfigModule.forFeature(HmsApplicationSystemConfig),
    ConfigModule.forFeature(XRoadConfig),
    ConfigModule.forFeature(IdsClientConfig),
  ],
  providers: [ApiConfiguration, ...exportedApis],
  exports: [...exportedApis],
})
export class HmsApplicationSystemModule {}
