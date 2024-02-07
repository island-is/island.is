import { Module } from '@nestjs/common'

import { LoginRestrictionsModule as AuthLoginRestrictionsModule } from '@island.is/auth-api-lib'

import { LoginRestrictionsController } from './login-restrictions.controller'

@Module({
  imports: [AuthLoginRestrictionsModule],
  controllers: [LoginRestrictionsController],
})
export class LoginRestrictionsModule {}
