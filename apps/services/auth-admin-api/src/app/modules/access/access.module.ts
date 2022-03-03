import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
} from '@island.is/auth-api-lib'

import { AccessController } from './access.controller'

@Module({
  imports: [SequelizeModule.forFeature([ApiScopeUser, ApiScopeUserAccess])],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
