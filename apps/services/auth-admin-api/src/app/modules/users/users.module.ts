import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
  Claim,
  UserIdentitiesService,
  UserIdentity,
} from '@island.is/auth-api-lib'

import { UserIdentitiesController } from './user-identities.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Claim,
      UserIdentity,
      ApiScopeUserAccess,
      ApiScopeUser,
    ]),
  ],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService, AccessService],
})
export class UsersModule {}
