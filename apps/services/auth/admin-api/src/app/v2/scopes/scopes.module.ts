import { Module } from '@nestjs/common'

import { ClientsModule, ResourcesModule } from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'
import { MeClientsScopesController } from './me-clients-scopes.controller'
import { MeScopeClientsController } from './me-scope-clients.controller'

@Module({
  imports: [ClientsModule, ResourcesModule],
  controllers: [
    MeScopesController,
    MeClientsScopesController,
    MeScopeClientsController,
  ],
})
export class ScopesModule {}
