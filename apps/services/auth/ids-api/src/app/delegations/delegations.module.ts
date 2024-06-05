import { Module } from '@nestjs/common'

import {
  ResourcesModule,
  DelegationsModule as AuthDelegationsModule,
  PersonalRepresentativeModule,
} from '@island.is/auth-api-lib'

import { DelegationsController } from './delegations.controller'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

@Module({
  imports: [
    ResourcesModule,
    AuthDelegationsModule,
    PersonalRepresentativeModule,
  ],
  controllers: [DelegationsController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
  ],
})
export class DelegationsModule {}
