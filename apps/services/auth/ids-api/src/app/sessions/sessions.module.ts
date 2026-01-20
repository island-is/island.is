import { Module } from '@nestjs/common'

import { SessionsModule as AuthSessionsModule } from '@island.is/auth-api-lib'

import { SessionsController } from './sessions.controller'

@Module({
  imports: [AuthSessionsModule],
  controllers: [SessionsController],
})
export class SessionsModule {}
