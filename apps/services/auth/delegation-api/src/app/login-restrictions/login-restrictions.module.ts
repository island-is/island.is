import { Module } from '@nestjs/common'

import { LoginRestrictionsModule as AuthLoginRestrictionsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { MeLoginRestrictionsController } from './me-login-restrictions.controller'

@Module({
  imports: [AuthLoginRestrictionsModule, FeatureFlagModule],
  controllers: [MeLoginRestrictionsController],
  providers: [],
})
export class LoginRestrictionsModule {}
