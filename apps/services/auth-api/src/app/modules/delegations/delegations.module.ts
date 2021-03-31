import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DelegationsService, Delegation } from '@island.is/auth-api-lib'
import { DelegationsController } from './delegations.controller'

@Module({
  imports: [SequelizeModule.forFeature([Delegation])],
  controllers: [DelegationsController],
  providers: [DelegationsService],
})
export class DelegationsModule {}
