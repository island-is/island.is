import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as kennitala from 'kennitala'
import uniqBy from 'lodash/uniqBy'

import { User } from '@island.is/auth-nest-tools'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import {
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import { isDefined } from '@island.is/shared/utils'

import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationValidity } from './types/delegationValidity'
import { partitionWithIndex } from './utils/partitionWithIndex'
import { getScopeValidityWhereClause } from './utils/scopes'
import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { Op } from 'sequelize'
import { ApiScopeInfo } from './delegations-incoming.service'

export const UNKNOWN_NAME = 'Óþekkt nafn'

type FindAllValidIncomingOptions = {
  nationalId: string
  domainName?: string
}

type FromNameInfo = {
  nationalId: string
  name: string
}

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(ApiScopeUserAccess)
    private apiScopeUserAccessModel: typeof ApiScopeUserAccess,
    private nationalRegistryClient: NationalRegistryClientService,
    private companyRegistryClient: CompanyRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private auditService: AuditService,
  ) {}

  async findAllValidIncoming(
    { nationalId, domainName }: FindAllValidIncomingOptions,
    useMaster = false,
  ): Promise<DelegationDTO[]> {
    const { delegations, fromNameInfo } = await this.findAllIncoming(
      {
        nationalId,
        validity: DelegationValidity.NOW,
        domainName,
      },
      useMaster,
    )

    const delegationDTOs = delegations.map((d) => d.toDTO())

    return delegationDTOs.map((d) => {
      const person = this.getPersonByNationalId(fromNameInfo, d.fromNationalId)

      return {
        ...d,
        fromName: person?.name ?? d.fromName ?? UNKNOWN_NAME,
      }
    })
  }

  async findAllAvailableIncoming(
    user: User,
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<MergedDelegationDTO[]> {
    const customApiScopes = clientAllowedApiScopes.filter(
      (s) => s.allowExplicitDelegationGrant,
    )
    if (requireApiScopes && !(customApiScopes && customApiScopes.length > 0)) {
      return []
    }

    const { delegations, fromNameInfo } = await this.findAllIncoming({
      nationalId: user.nationalId,
      validity: DelegationValidity.NOW,
    })

    const validDelegations = delegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeIsValid(s, customApiScopes),
        )
        return d
      })
      .filter((d) => d.delegationScopes && d.delegationScopes.length > 0)

    const protectedScopes = customApiScopes.filter((s) => s.isAccessControlled)

    const accessControlList = await this.findAccessControlList(
      delegations,
      protectedScopes,
    )
    const allowedDelegations = validDelegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeAllowed(
            s,
            customApiScopes,
            accessControlList,
            d.fromNationalId,
          ),
        )
        return d
      })
      .filter(
        (d) =>
          !requireApiScopes ||
          (d.delegationScopes && d.delegationScopes.length > 0),
      )

    const mergedDelegationDTOs = uniqBy(
      allowedDelegations.map((d) => d.toMergedDTO()),
      'fromNationalId',
    )

    return mergedDelegationDTOs.map((d) => {
      const person = this.getPersonByNationalId(fromNameInfo, d.fromNationalId)

      return {
        ...d,
        fromName: person?.name ?? d.fromName ?? UNKNOWN_NAME,
      }
    })
  }

  private async findAllIncoming(
    {
      nationalId,
      domainName,
      validity,
    }: FindAllValidIncomingOptions & {
      validity: DelegationValidity
    },
    useMaster = false,
  ): Promise<{ delegations: Delegation[]; fromNameInfo: FromNameInfo[] }> {
    let whereOptions = getScopeValidityWhereClause(validity)
    if (domainName) whereOptions = { ...whereOptions, domainName: domainName }

    const delegations = await this.delegationModel.findAll({
      useMaster,
      where: {
        toNationalId: nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          where: whereOptions,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              required: true,
              where: {
                enabled: true,
                allowExplicitDelegationGrant: true,
              },
            },
          ],
        },
      ],
    })

    // Check live status, i.e. dead or alive for delegations
    const { aliveDelegations, deceasedDelegations, fromNameInfo } =
      await this.getLiveStatusFromDelegations(delegations)

    if (deceasedDelegations.length > 0) {
      // Delete all deceased delegations by deleting them and their scopes.
      const deletePromises = deceasedDelegations.map((delegation) =>
        delegation.destroy(),
      )

      await Promise.all(deletePromises)

      this.auditService.audit({
        action: 'deleteDelegationsForMissingPeople',
        resources: deceasedDelegations.map(({ id }) => id).filter(isDefined),
        system: true,
      })
    }

    return { delegations: aliveDelegations, fromNameInfo }
  }

  private checkIfScopeIsValid(
    scope: DelegationScope,
    customApiScopes: ApiScopeInfo[],
  ): boolean {
    return customApiScopes.some((s) => s.name === scope.scopeName)
  }

  private checkIfScopeAllowed(
    scope: DelegationScope,
    customApiScopes: ApiScopeInfo[],
    accesses: ApiScopeUserAccess[],
    fromNationalId: string,
  ): boolean {
    const protectedScope = customApiScopes.find(
      (s) => s.name === scope.scopeName && s.isAccessControlled,
    )

    if (!protectedScope) {
      return true
    }

    const access = accesses.find(
      (a) => a.scope === scope.scopeName && a.nationalId === fromNationalId,
    )

    if (access) {
      return kennitala.isCompany(fromNationalId)
    }

    return false
  }

  /**
   * Divides delegations into alive and deceased delegations
   * - Makes calls for every delegation to NationalRegistry to check if the person exists.
   * - Divides the delegations into alive and deceased delegations, based on
   *   1. All companies will be divided into alive delegations.
   *   2. If the person exists in NationalRegistry, then the delegation is alive.
   */
  private async getLiveStatusFromDelegations(
    delegations: Delegation[],
  ): Promise<{
    aliveDelegations: Delegation[]
    deceasedDelegations: Delegation[]
    fromNameInfo: FromNameInfo[]
  }> {
    if (delegations.length === 0) {
      return {
        aliveDelegations: [],
        deceasedDelegations: [],
        fromNameInfo: [],
      }
    }

    const delegationsPromises = delegations.map(({ fromNationalId }) =>
      kennitala.isCompany(fromNationalId)
        ? this.companyRegistryClient
            .getCompany(fromNationalId)
            .catch(this.handlerGetError)
        : this.nationalRegistryClient
            .getIndividual(fromNationalId)
            .catch(this.handlerGetError),
    )

    try {
      // Check if delegations is linked to a person, i.e. not deceased
      const identities = await Promise.all(delegationsPromises)
      const identitiesValuesNoError = identities
        .filter(this.isNotError)
        .filter(isDefined)
        .map((identity) => ({
          nationalId: identity.nationalId,
          name:
            (kennitala.isCompany(identity.nationalId)
              ? (identity as CompanyExtendedInfo).name
              : (identity as IndividualDto).fullName) ?? UNKNOWN_NAME,
        }))

      // Divide delegations into alive or deceased delegations.
      const [aliveDelegations, deceasedDelegations] = partitionWithIndex(
        delegations,
        ({ fromNationalId }, index) =>
          // All companies will be divided into aliveDelegations
          kennitala.isCompany(fromNationalId) ||
          // Pass through altough Þjóðskrá API throws an error since it is not required to view the delegation.
          identities[index] instanceof Error ||
          // Make sure we can match the person to the delegation, i.e. not deceased
          (identities[index] as IndividualDto)?.nationalId === fromNationalId,
      )

      return {
        aliveDelegations,
        deceasedDelegations,
        fromNameInfo: identitiesValuesNoError,
      }
    } catch (error) {
      this.logger.error(
        `Error getting live status from delegations. Delegations: ${delegations.map(
          (d) => d.id,
        )}`,
        error,
      )

      // We do not want to fail the whole request if we cannot get the live status from delegations.
      // Therefore, we return all delegations as alive delegations.
      return {
        aliveDelegations: delegations,
        deceasedDelegations: [],
        fromNameInfo: [],
      }
    }
  }

  private handlerGetError(error: null | Error) {
    return error
  }

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }

  /**
   * Finds person by nationalId.
   */
  private getPersonByNationalId(
    identities: Array<FromNameInfo | null>,
    nationalId: string,
  ) {
    return identities.find((identity) => identity?.nationalId === nationalId)
  }

  private async findAccessControlList(
    delegations: Delegation[],
    protectedScopes: ApiScopeInfo[],
  ): Promise<ApiScopeUserAccess[]> {
    if (
      !delegations ||
      delegations.length === 0 ||
      !protectedScopes ||
      protectedScopes.length === 0
    )
      return []

    const nationalIds = delegations.map((d) => d.fromNationalId)

    return await this.apiScopeUserAccessModel.findAll({
      where: {
        [Op.and]: [
          { nationalId: { [Op.in]: nationalIds } },
          { scope: { [Op.in]: protectedScopes.map((s) => s.name) } },
        ],
      },
    })
  }
}
