import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

/** Defaults to false: an outage blocks sensitive grants instead of allowing them. */
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
