import { Module } from '@nestjs/common'
import { CitizenshipClient } from './citizenshipClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, CitizenshipClient],
  exports: [CitizenshipClient],
})
export class CitizenshipClientModule {}
