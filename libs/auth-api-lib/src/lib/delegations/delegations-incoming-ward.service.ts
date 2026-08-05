import { Inject, Injectable, Logger } from '@nestjs/common'

import { isUnderXAge } from './utils/isUnderXAge'
import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationDTO } from './dto/delegation.dto'

import { User } from '@island.is/auth-nest-tools'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

@Injectable()
export class DelegationsIncomingWardService {
  constructor(
    private nationalRegistryClient: NationalRegistryClientService,
    private nationalRegistryV3Client: NationalRegistryV3ClientService,
    private readonly featureFlagService: FeatureFlagService,
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
      const useNationalRegistryV3 = await this.featureFlagService.getValue(
        Features.isDelegationIncomingWardV3Enabled,
        false,
        user,
      )

      // delegations for legal guardians of children under 18
      const legalGuardianDelegations = useNationalRegistryV3
        ? await this.getLegalGuardianDelegationsV3(user)
        : await this.getLegalGuardianDelegationsV2(user)

      // delegations for legal guardians of children under 16
      const legalGuardianMinorDelegations = legalGuardianDelegations
        .filter((delegation) => isUnderXAge(16, delegation.fromNationalId))
        .map((delegation) => ({
          ...delegation,
          type: AuthDelegationType.LegalGuardianMinor,
        }))

      return [...legalGuardianDelegations, ...legalGuardianMinorDelegations]
    } catch (error) {
      this.logger.error('Error in findAllWards', error)
    }

    return []
  }

  private async getLegalGuardianDelegationsV3(
    user: User,
  ): Promise<DelegationDTO[]> {
    const individual = await this.nationalRegistryV3Client.getAllDataIndividual(
      user.nationalId,
    )

    // Midlun returns each ward (kennitala + name) on the guardian's own record,
    // so there is no need for a follow-up lookup per child.
    const children = (individual?.forsja?.born ?? []).filter(
      (child) => !!child.barnKennitala && !!child.barnNafn,
    )

    const distinct = children.filter(
      (child, i) =>
        children.findIndex(
          (other) => other.barnKennitala === child.barnKennitala,
        ) === i,
    )

    return distinct.map(
      (child) =>
        <DelegationDTO>{
          toNationalId: user.nationalId,
          fromNationalId: child.barnKennitala,
          fromName: child.barnNafn,
          type: AuthDelegationType.LegalGuardian,
          provider: AuthDelegationProvider.NationalRegistry,
        },
    )
  }

  private async getLegalGuardianDelegationsV2(
    user: User,
  ): Promise<DelegationDTO[]> {
    const response = await this.nationalRegistryClient.getCustodyChildren(user)

    const distinct = response.filter(
      (r: string, i: number) => response.indexOf(r) === i,
    )

    const result = await Promise.all(
      distinct.map(async (nationalId) =>
        this.nationalRegistryClient.getIndividual(nationalId),
      ),
    )

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
  }
}
