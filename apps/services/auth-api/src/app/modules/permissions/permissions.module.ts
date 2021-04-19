import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  AccessService,
  AdminAccess,
  ResourcesService,
} from '@island.is/auth-api-lib'
import { PermissionsController } from './permissions.controller'

@Module({
  imports: [SequelizeModule.forFeature([AdminAccess])],
  controllers: [PermissionsController],
  providers: [AccessService, ResourcesService],
})
export class PermissionsModule {}
