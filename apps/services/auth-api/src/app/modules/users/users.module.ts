import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  Claim,
  UserIdentitiesService,
  UserIdentity,
} from '@island.is/auth-api-lib'

import { UserIdentitiesController } from './user-identities.controller'

@Module({
  imports: [SequelizeModule.forFeature([Claim, UserIdentity])],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService],
})
export class UsersModule {}
