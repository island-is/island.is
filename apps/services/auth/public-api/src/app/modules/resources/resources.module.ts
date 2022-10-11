import { Module } from '@nestjs/common'
import { ResourcesModule as AuthResourcesModule } from '@island.is/auth-api-lib'
import { ScopesController } from './scopes.controller'

@Module({
  imports: [AuthResourcesModule],
  controllers: [ScopesController],
  providers: [],
})
export class ResourcesModule {}
