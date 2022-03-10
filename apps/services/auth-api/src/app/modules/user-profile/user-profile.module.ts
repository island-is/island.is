import { Module } from '@nestjs/common'
import { UserProfileService } from '@island.is/auth-api-lib'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { UserProfileController } from './user-profile.controller'

@Module({
  imports: [NationalRegistryClientModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
