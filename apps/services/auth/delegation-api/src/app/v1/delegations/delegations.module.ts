import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'

import { MeDelegationsController } from './meDelegations.controller'

@Module({
  imports: [AuthDelegationsModule],
  controllers: [MeDelegationsController],
  providers: [],
})
export class DelegationsModule {}
