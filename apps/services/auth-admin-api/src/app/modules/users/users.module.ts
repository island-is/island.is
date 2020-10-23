import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesController } from './user-identities.controller'
import {
  UserIdentity,
  Claim,
  UserIdentitiesService,
} from '@island.is/auth-api-lib'

@Module({
  imports: [SequelizeModule.forFeature([Claim, UserIdentity])],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService],
})
export class UsersModule {}
