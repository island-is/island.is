import { Inject, Logger } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { PersonalRepresentativeDTO } from '../personal-representative/dto/personal-representative.dto'
import { PersonalRepresentativeService } from '../personal-representative/services/personalRepresentative.service'
import { AliveStatusService } from './alive-status.service'
import { UNKNOWN_NAME } from './constants/names'
import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationDTO } from './dto/delegation.dto'
import { NationalRegistryV3FeatureService } from './national-registry-v3-feature.service'

type FindAllIncomingOptions = {
  nationalId: string
  clientAllowedApiScopes?: ApiScopeInfo[]
  requireApiScopes?: boolean
}

export class DelegationsIncomingRepresentativeService {
  constructor(
    private prService: PersonalRepresentativeService,
    private aliveStatusService: AliveStatusService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private auditService: AuditService,
    private readonly nationalRegistryV3FeatureService: NationalRegistryV3FeatureService,
  ) {}

  async findAllIncoming(
    {
      nationalId,
      clientAllowedApiScopes,
      requireApiScopes,
    }: FindAllIncomingOptions,
    useMaster = false,
    user?: User,
  ): Promise<DelegationDTO[]> {
    if (
      requireApiScopes &&
      clientAllowedApiScopes &&
      !clientAllowedApiScopes.some(
        (s) =>
          s.supportedDelegationTypes?.some(
            (dt) =>
              dt.delegationType == AuthDelegationType.PersonalRepresentative,
          ) && !s.isAccessControlled,
      )
    ) {
      return []
    }

    try {
      const toDelegationDTO = (
        name: string,
        representative: PersonalRepresentativeDTO,
      ): DelegationDTO => ({
        toNationalId: representative.nationalIdPersonalRepresentative,
        fromNationalId: representative.nationalIdRepresentedPerson,
        fromName: name,
        type: AuthDelegationType.PersonalRepresentative,
        provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
        rights: representative.rights,
        prDelegationType: representative.prDelegationTypes,
      })

      const personalRepresentatives =
        await this.prService.getByPersonalRepresentative(
          {
            nationalIdPersonalRepresentative: nationalId,
          },
          useMaster,
        )
      // Filter if personal representative actually has a scope in client allowed scopes
      personalRepresentatives.filter((pr) => {
        if (pr.prDelegationTypes) {
          return pr.prDelegationTypes.some((type) =>
            clientAllowedApiScopes?.some(
              (scope) =>
                scope.supportedDelegationTypes?.some(
                  (dt) =>
                    dt.delegationType ==
                    AuthDelegationType.PersonalRepresentative,
                ) &&
                scope.name === type.name &&
                !scope.isAccessControlled,
            ),
          )
        }
      })

      const isNationalRegistryV3DeceasedStatusEnabled =
        user && (await this.nationalRegistryV3FeatureService.getValue(user))

      const { aliveNationalIds, deceasedNationalIds, aliveNameInfo } =
        await this.aliveStatusService.getStatus(
          personalRepresentatives.map((d) => d.nationalIdRepresentedPerson),
          isNationalRegistryV3DeceasedStatusEnabled ?? false,
        )

      if (deceasedNationalIds.length > 0) {
        const deceased = personalRepresentatives.filter((pr) =>
          deceasedNationalIds.includes(pr.nationalIdRepresentedPerson),
        )
        await this.makePersonalRepresentativesInactive(deceased)
      }

      const alive = personalRepresentatives.filter((pr) =>
        aliveNationalIds.includes(pr.nationalIdRepresentedPerson),
      )

      return alive.map((pr) => {
        const person = aliveNameInfo.find(
          (n) => n.nationalId === pr.nationalIdRepresentedPerson,
        )
        return toDelegationDTO(person?.name ?? UNKNOWN_NAME, pr)
      })
    } catch (error) {
      this.logger.error('Error in findAllRepresentedPersons', error)
    }

    return []
  }

  private async makePersonalRepresentativesInactive(
    personalRepresentatives: PersonalRepresentativeDTO[],
  ) {
    // Delete all personal representatives and their rights
    const inactivePromises = personalRepresentatives
      .map(({ id }) => (id ? this.prService.makeInactive(id) : undefined))
      .filter(isDefined)

    await Promise.all(inactivePromises)

    this.auditService.audit({
      action: 'makePersonalRepresentativesInactiveForMissingPeople',
      resources: personalRepresentatives.map(({ id }) => id).filter(isDefined),
      system: true,
    })
  }
}
