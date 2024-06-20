import { Module } from '@nestjs/common'
import { PasskeysController } from './passkeys.controller'
import { PasskeysCoreConfig, PasskeysCoreModule } from '@island.is/auth-api-lib'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    PasskeysCoreConfig.registerOptional(),
    PasskeysCoreModule,
    FeatureFlagModule,
  ],
  controllers: [PasskeysController],
  providers: [],
})
export class PasskeysModule {}
