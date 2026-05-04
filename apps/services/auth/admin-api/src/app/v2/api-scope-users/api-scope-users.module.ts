import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'

import { MeApiScopeUsersController } from './me-api-scope-users.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [MeApiScopeUsersController],
})
export class ApiScopeUsersV2Module {}
