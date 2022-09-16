import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ResourcesController } from './resources.controller'
import {
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
  TranslationModule,
  ResourcesModule as AuthResourcesModule,
} from '@island.is/auth-api-lib'

@Module({
  imports: [
    AuthResourcesModule,
    SequelizeModule.forFeature([ApiScopeUserAccess, ApiScopeUser]),
    TranslationModule,
  ],
  controllers: [ResourcesController],
  providers: [AccessService],
})
export class ResourcesModule {}
