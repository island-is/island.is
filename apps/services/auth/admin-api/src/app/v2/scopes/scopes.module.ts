import { Module } from '@nestjs/common'

import {
  ClientsModule,
  ResourcesModule,
  TenantsService,
} from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'
import { MeClientsScopesController } from './me-clients-scopes.controller'
import { MeScopeClientsController } from './me-scope-clients.controller'
import { MeScopeUsersController } from './me-scope-users.controller'

@Module({
  imports: [ClientsModule, ResourcesModule],
  controllers: [
    MeScopesController,
    MeClientsScopesController,
    MeScopeClientsController,
    MeScopeUsersController,
  ],
  providers: [TenantsService],
})
export class ScopesModule {}
