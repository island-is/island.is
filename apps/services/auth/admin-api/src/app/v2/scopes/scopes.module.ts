import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'
import { MeClientsScopesController } from './me-clients-scopes.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [MeScopesController, MeClientsScopesController],
})
export class ScopesModule {}
