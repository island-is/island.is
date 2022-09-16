import { Module } from '@nestjs/common'
import { ResourcesController } from './resources.controller'
import {
  TranslationModule,
  ResourcesModule as AuthResourcesModule,
} from '@island.is/auth-api-lib'

@Module({
  imports: [AuthResourcesModule, TranslationModule],
  controllers: [ResourcesController],
  providers: [],
})
export class ResourcesModule {}
