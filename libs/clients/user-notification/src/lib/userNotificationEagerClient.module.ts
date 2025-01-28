import { Module } from '@nestjs/common'

import { eagerExportedApis } from './eagerApiConfiguration'

@Module({
  providers: eagerExportedApis,
  exports: eagerExportedApis,
})
export class UserNotificationEagerClientModule {}
