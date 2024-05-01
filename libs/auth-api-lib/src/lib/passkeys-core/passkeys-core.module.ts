import { Module } from '@nestjs/common'
import { PasskeysCoreService } from './passkeys-core.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { PasskeyModel } from './models/passkey.model'
import { CacheModule } from './passkeys-core.cache'

// TODO:
// import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [SequelizeModule.forFeature([PasskeyModel]), CacheModule],
  providers: [PasskeysCoreService],
  exports: [PasskeysCoreService],
})
export class PasskeysCoreModule {}
