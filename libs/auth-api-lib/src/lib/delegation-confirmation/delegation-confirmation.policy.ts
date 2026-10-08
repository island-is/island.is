import { Inject, Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import { DelegationConfig } from '../delegations/DelegationConfig'

/**
 * Whether scopes marked `requiresConfirmation` need a confirmation when this
 * person grants them. The one place that decides it: the grant, the scope
 * listing and the guard below every write all ask here.
 *
 * Off in the environment (DelegationConfig.confirmationEnabled), never. On, the
 * feature flag picks who, and if the flag can't be read they do: a ConfigCat
 * outage must not quietly hand out sensitive scopes in one click.
 */
@Injectable()
export class DelegationConfirmationPolicy {
  constructor(
    @Inject(DelegationConfig.KEY)
    private readonly delegationConfig: ConfigType<typeof DelegationConfig>,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async isRequired(grantor: User): Promise<boolean> {
    if (!this.delegationConfig.confirmationEnabled) {
      return false
    }

    return this.featureFlagService.getValue(
      Features.isDelegationConfirmationEnabled,
      true,
      grantor,
    )
  }
}
