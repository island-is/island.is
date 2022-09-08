import { Module } from '@nestjs/common'
import { UserProfileService } from '@island.is/auth-api-lib'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { UserProfileController } from './user-profile.controller'

@Module({
  imports: [
    NationalRegistryClientModule,
    UserProfileClientModule,
    CompanyRegistryClientModule,
    FeatureFlagModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
