import { Module } from '@nestjs/common'
import { UserNotificationApiProvider } from './apiConfiguration'

@Module({
  providers: [UserNotificationApiProvider],
  exports: [UserNotificationApiProvider],
})
export class UserNotificationClientModule {}
