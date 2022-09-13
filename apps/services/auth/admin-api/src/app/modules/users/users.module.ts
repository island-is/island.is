import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesController } from './user-identities.controller'
import {
  UserIdentitiesModule,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'

@Module({
  imports: [
    SequelizeModule.forFeature([ApiScopeUserAccess, ApiScopeUser]),
    UserIdentitiesModule,
  ],
  controllers: [UserIdentitiesController],
  providers: [AccessService],
})
export class UsersModule {}
