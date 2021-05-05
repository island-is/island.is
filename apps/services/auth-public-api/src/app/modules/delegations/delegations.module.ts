import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DelegationsService,
  Delegation,
  DelegationScopeService,
  DelegationScope,
} from '@island.is/auth-api-lib'
import { DelegationsController } from './delegations.controller'
import { RskModule } from '@island.is/clients/rsk/v2'
import { RskConfig } from './rsk.config'

@Module({
  imports: [
    SequelizeModule.forFeature([Delegation, DelegationScope]),
    RskModule.register(RskConfig.get()),
  ],
  controllers: [DelegationsController],
  providers: [DelegationsService, DelegationScopeService],
})
export class DelegationsModule {}
