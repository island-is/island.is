import { Module } from '@nestjs/common'

import { UserIdentitiesModule } from '@island.is/auth-api-lib'

import { MeUserIdentitiesController } from './me-user-identities.controller'

@Module({
  imports: [UserIdentitiesModule],
  controllers: [MeUserIdentitiesController],
})
export class UserIdentitiesV2Module {}
