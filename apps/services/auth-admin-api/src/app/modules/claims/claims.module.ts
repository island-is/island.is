import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClaimsController } from './claims.controller'
import { Claim, ClaimsService } from '@island.is/auth-api-lib'

@Module({
  imports: [SequelizeModule.forFeature([Claim])],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}
