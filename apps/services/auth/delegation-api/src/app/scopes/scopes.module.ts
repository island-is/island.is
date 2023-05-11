import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'

import { ScopesController } from './scopes.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [ScopesController],
})
export class ScopesModule {}
