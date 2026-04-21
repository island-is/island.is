import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { FeatureFlagValues } from './featureFlags.model'
import { FeatureFlagsService } from './featureFlags.service'

@UseGuards(IdsUserGuard)
@Resolver()
export class FeatureFlagsResolver {
  constructor(private readonly service: FeatureFlagsService) {}

  @Query(() => FeatureFlagValues, {
    name: 'featureFlags',
  })
  featureFlags(@CurrentUser() user: User): Promise<FeatureFlagValues> {
    return this.service.getAllForUser(user)
  }
}
