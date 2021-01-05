import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  GrantType,
  GrantTypeService,
  AccessService,
  AdminAccess,
} from '@island.is/auth-api-lib'
import { GrantTypeController } from './grant-types.controller'

@Module({
  imports: [SequelizeModule.forFeature([GrantType, AdminAccess])],
  controllers: [GrantTypeController],
  providers: [GrantTypeService, AccessService],
})
export class GrantTypesModule {}
