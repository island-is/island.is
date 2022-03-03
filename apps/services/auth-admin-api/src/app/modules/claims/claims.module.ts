import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
  Claim,
  ClaimsService,
} from '@island.is/auth-api-lib'

import { ClaimsController } from './claims.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([Claim, ApiScopeUserAccess, ApiScopeUser]),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService, AccessService],
})
export class ClaimsModule {}
