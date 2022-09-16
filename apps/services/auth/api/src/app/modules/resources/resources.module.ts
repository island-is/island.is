import { Module } from '@nestjs/common'
import { ResourcesController } from './resources.controller'
import {
  ResourcesModule as AuthResourcesModule,
  TranslationModule,
} from '@island.is/auth-api-lib'

@Module({
  imports: [AuthResourcesModule, TranslationModule],
  controllers: [ResourcesController],
  providers: [],
})
export class ResourcesModule {}
