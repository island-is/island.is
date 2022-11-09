import { Module } from '@nestjs/common'

import {
  ResourcesModule,
  DelegationsModule as AuthDelegationsModule,
  PersonalRepresentativeModule,
} from '@island.is/auth-api-lib'

import { DelegationsController } from './delegations.controller'

@Module({
  imports: [
    ResourcesModule,
    AuthDelegationsModule,
    PersonalRepresentativeModule,
  ],
  controllers: [DelegationsController],
  providers: [],
})
export class DelegationsModule {}
