import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
  GrantType,
  GrantTypeService,
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
