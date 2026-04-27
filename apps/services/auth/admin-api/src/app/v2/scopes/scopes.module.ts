import { Module } from '@nestjs/common'

import { ClientsModule, TenantsService } from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'
import { MeClientsScopesController } from './me-clients-scopes.controller'
import { MeScopeClientsController } from './me-scope-clients.controller'

@Module({
  imports: [ClientsModule],
  controllers: [
    MeScopesController,
    MeClientsScopesController,
    MeScopeClientsController,
  ],
  providers: [TenantsService],
})
export class ScopesModule {}
