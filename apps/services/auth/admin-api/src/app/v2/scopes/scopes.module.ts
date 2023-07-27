import { Module } from '@nestjs/common'

import { ClientsModule, TenantsService } from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'
import { MeClientsScopesController } from './me-clients-scopes.controller'

@Module({
  imports: [ClientsModule],
  controllers: [MeScopesController, MeClientsScopesController],
  providers: [TenantsService],
})
export class ScopesModule {}
