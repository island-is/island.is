import { Module } from '@nestjs/common'

import { DeviceRegistrationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { MeAppLoginsController } from './me-app-logins.controller'

@Module({
  imports: [DeviceRegistrationsModule, FeatureFlagModule],
  controllers: [MeAppLoginsController],
})
export class AppLoginsModule {}
