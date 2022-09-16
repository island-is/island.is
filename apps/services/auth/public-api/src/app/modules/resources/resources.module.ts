import { Module } from '@nestjs/common'
import {
  ResourcesModule as AuthResourcesModule,
  TranslationModule,
} from '@island.is/auth-api-lib'
import { ScopesController } from './scopes.controller'

@Module({
  imports: [AuthResourcesModule, TranslationModule],
  controllers: [ScopesController],
  providers: [],
})
export class ResourcesModule {}
