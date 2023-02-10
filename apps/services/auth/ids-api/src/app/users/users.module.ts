import { Module } from '@nestjs/common'
import { UserIdentitiesController } from './user-identities.controller'
import { UserIdentitiesModule } from '@island.is/auth-api-lib'

@Module({
  imports: [UserIdentitiesModule],
  controllers: [UserIdentitiesController],
  providers: [],
})
export class UsersModule {}
