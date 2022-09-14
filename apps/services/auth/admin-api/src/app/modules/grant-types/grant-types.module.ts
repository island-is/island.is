import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  GrantType,
  GrantTypeService,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'
import { GrantTypeController } from './grant-types.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([GrantType, ApiScopeUserAccess, ApiScopeUser]),
  ],
  controllers: [GrantTypeController],
  providers: [GrantTypeService, AccessService],
})
export class GrantTypesModule {}
