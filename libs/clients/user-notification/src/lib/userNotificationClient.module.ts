import { Module } from '@nestjs/common'

import { exportedApis } from './apiConfiguration'

@Module({
  providers: exportedApis,
  exports: exportedApis,
})
export class UserNotificationClientModule {}
