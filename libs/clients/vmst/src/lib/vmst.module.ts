import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { ApiConfiguration } from './apiConfiguration'

export interface VMSTModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}
@Module({
  exports: [...exportedApis],
  providers: [ApiConfiguration, ...exportedApis],
})
export class VMSTModule {}
