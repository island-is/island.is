import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DelegationScopeService,
  DelegationScope,
} from '@island.is/auth-api-lib'
import { DelegationScopeController } from './delegation-scope.controller'

@Module({
  imports: [SequelizeModule.forFeature([DelegationScope])],
  controllers: [DelegationScopeController],
  providers: [DelegationScopeService],
})
export class DelegationScopeModule {}
