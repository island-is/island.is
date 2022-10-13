import { Module } from '@nestjs/common'

import {
  DelegationsModule as AuthDelegationsModule,
  ResourcesModule as AuthResourcesModule,
} from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { DomainsController } from './domains.controller'

@Module({
  imports: [
    AuthDelegationsModule,
    AuthResourcesModule,
    FeatureFlagModule,
    ProblemModule,
  ],
  controllers: [DomainsController],
  providers: [],
})
export class DomainsModule {}
