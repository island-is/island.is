import { Module } from '@nestjs/common'
import { UserProfileService } from '@island.is/auth-api-lib'
import { NationalRegistryModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryConfig } from './national-registry.config'
import { UserProfileController } from './user-profile.controller'

@Module({
  imports: [NationalRegistryModule.register(NationalRegistryConfig)],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
