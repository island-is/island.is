import { Module } from '@nestjs/common'
import { CitizenshipClient } from './citizenshipClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, CitizenshipClient, ...exportedApis],
  exports: [CitizenshipClient],
})
export class CitizenshipClientModule {}
