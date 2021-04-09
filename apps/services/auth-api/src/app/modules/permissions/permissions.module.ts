import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccessService, AdminAccess } from '@island.is/auth-api-lib'
import { PermissionsController } from './permissions.controller'

@Module({
  imports: [SequelizeModule.forFeature([AdminAccess])],
  controllers: [PermissionsController],
  providers: [AccessService],
})
export class PermissionsModule {}
