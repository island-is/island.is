import { Inject, Injectable, Logger } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationDTO } from './dto/delegation.dto'

@Injectable()
export class DelegationsIncomingWardService {
  constructor(
    private nationalRegistryClient: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllIncoming(
    user: User,
    clientAllowedApiScopes?: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<DelegationDTO[]> {
    if (
      requireApiScopes &&
      clientAllowedApiScopes &&
      !clientAllowedApiScopes.some(
        (s) =>
          s.supportedDelegationTypes?.some(
            (dt) => dt.delegationType == AuthDelegationType.LegalGuardian,
          ) && !s.isAccessControlled,
      )
    ) {
      return []
    }

    try {
      const response = await this.nationalRegistryClient.getCustodyChildren(
        user,
      )

      const distinct = response.filter(
        (r: string, i: number) => response.indexOf(r) === i,
      )

      const resultPromises = distinct.map(async (nationalId) =>
        this.nationalRegistryClient.getIndividual(nationalId),
      )

      const result = await Promise.all(resultPromises)

      return result
        .filter((p): p is IndividualDto => p !== null)
        .map(
          (p) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: p.nationalId,
              fromName: p.name,
              type: AuthDelegationType.LegalGuardian,
              provider: AuthDelegationProvider.NationalRegistry,
            },
        )
    } catch (error) {
      this.logger.error('Error in findAllWards', error)
    }

    return []
  }
}
