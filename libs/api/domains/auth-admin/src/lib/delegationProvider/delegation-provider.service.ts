import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'

import { environments } from '../shared/constants/environments'
import {
  DelegationProviderEnvironment,
  DelegationProviderPayload,
} from './dto/delegation-provider.dto'

@Injectable()
export class DelegationProviderService extends MultiEnvironmentService {
  async getDelegationProviders(user: User): Promise<DelegationProviderPayload> {
    const delegationProvidersSettledPromises = await Promise.allSettled(
      environments.map(async (environment) =>
        this.makeRequest(user, environment, (api) =>
          api.providersControllerGetDelegationProvidersRaw(),
        ),
      ),
    )

    const delegationProviderEnvironments = this.handleSettledPromises(
      delegationProvidersSettledPromises,
      {
        mapper: (
          delegationProviders,
          index,
        ): DelegationProviderEnvironment => ({
          environment: environments[index],
          providers: delegationProviders.data ?? [],
        }),
        prefixErrorMessage: 'Failed to fetch delegation providers',
      },
    )

    return {
      environments: delegationProviderEnvironments,
    }
  }
}
