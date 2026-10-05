import { Global, Module } from '@nestjs/common'

import { CibaClient } from '@island.is/auth/step-up'
import { createRedisCluster } from '@island.is/cache'
import { logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { StepUpConfig } from './step-up.config'
import { StepUpGuard } from './step-up.guard'
import { StepUpResolver } from './step-up.resolver'
import { STEP_UP_CIBA_CLIENT, StepUpService } from './step-up.service'
import {
  MemoryStepUpStore,
  RedisStepUpStore,
  STEP_UP_STORE,
} from './step-up.store'

/**
 * Global so any domain can put @StepUpRequired on its resolvers without
 * importing this module.
 */
@Global()
@Module({
  imports: [FeatureFlagModule],
  providers: [
    StepUpResolver,
    StepUpService,
    StepUpGuard,
    {
      provide: STEP_UP_CIBA_CLIENT,
      useFactory: (config: ConfigType<typeof StepUpConfig>) =>
        new CibaClient({
          issuer: config.issuer,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: config.scope,
          requiredAcr: config.requiredAcr,
        }),
      inject: [StepUpConfig.KEY],
    },
    {
      provide: STEP_UP_STORE,
      useFactory: (config: ConfigType<typeof StepUpConfig>) => {
        if (config.redis.nodes.length === 0) {
          logger.warn(
            'Step-up has no Redis configured; unlocks are kept per process.',
          )
          return new MemoryStepUpStore()
        }
        return new RedisStepUpStore(
          createRedisCluster({
            name: 'api-step-up',
            nodes: config.redis.nodes,
            ssl: config.redis.ssl,
          }),
        )
      },
      inject: [StepUpConfig.KEY],
    },
  ],
  // FeatureFlagModule is re-exported so the guard can run in any domain.
  exports: [StepUpService, StepUpGuard, FeatureFlagModule],
})
export class StepUpModule {}
