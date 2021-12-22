import { Module } from '@nestjs/common'
import { UserProfileApi } from '../../gen/fetch'

import { ApiConfiguration } from './apiConfiguration'
// import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration],
  exports: [UserProfileApi],
})
export class UserProfileClientModule {}
