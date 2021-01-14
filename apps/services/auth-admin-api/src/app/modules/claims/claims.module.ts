import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClaimsController } from './claims.controller'
import {
  Claim,
  ClaimsService,
  AccessService,
  AdminAccess,
} from '@island.is/auth-api-lib'

@Module({
  imports: [SequelizeModule.forFeature([Claim, AdminAccess])],
  controllers: [ClaimsController],
  providers: [ClaimsService, AccessService],
})
export class ClaimsModule {}
