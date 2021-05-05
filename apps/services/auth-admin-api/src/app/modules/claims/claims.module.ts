import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClaimsController } from './claims.controller'
import {
  Claim,
  ClaimsService,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'

@Module({
  imports: [
    SequelizeModule.forFeature([Claim, ApiScopeUserAccess, ApiScopeUser]),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService, AccessService],
})
export class ClaimsModule {}
