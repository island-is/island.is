import { Module } from '@nestjs/common'

import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, ...exportedApis],
  exports: [...exportedApis],
})
export class UserProfileClientModule {}
