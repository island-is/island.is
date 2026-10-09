import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

/**
 * Whether this person can confirm a grant right now, and so may grant scopes
 * marked `requiresConfirmation` at all. A marked scope is never granted
 * without a confirmation: when one can't be had, it can't be granted.
 *
 * Read with default false, so a ConfigCat outage — or a missing flag — means
 * sensitive scopes can't be granted for a while, never that they are granted
 * in one click.
 */
@Injectable()
export class DelegationConfirmationPolicy {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  isAvailable(grantor: User): Promise<boolean> {
    return this.featureFlagService.getValue(
      Features.isDelegationConfirmationEnabled,
      false,
      grantor,
    )
  }
}
