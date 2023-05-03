import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'
import { MeScopesController } from './me-scopes.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [MeScopesController],
})
export class ScopesModule {}
