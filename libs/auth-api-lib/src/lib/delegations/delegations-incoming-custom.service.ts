import { AuthDelegationType, User } from '@island.is/auth-nest-tools'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import uniqBy from 'lodash/uniqBy'
import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationConfig } from './DelegationConfig'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationValidity } from './types/delegationValidity'
import { getScopeValidityWhereClause } from './utils/scopes'
import * as kennitala from 'kennitala'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { partitionWithIndex } from './utils/partitionWithIndex'
import { AuditService } from '@island.is/nest/audit'
import { DelegationsOutgoingService } from './delegations-outgoing.service'

export const UNKNOWN_NAME = 'Óþekkt nafn'

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScopeModel: typeof ClientAllowedScope,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private nationalRegistryClient: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private auditService: AuditService,
    private delegationsOutgoingService: DelegationsOutgoingService,
  ) {}

  async findAllValidIncoming(
    user: User,
    domainName?: string,
  ): Promise<DelegationDTO[]> {
    const { delegations, fromNameInfo } = await this.findAllIncoming(
      user,
      DelegationValidity.NOW,
      domainName,
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

  async findAllAvailableIncoming(user: User): Promise<MergedDelegationDTO[]> {
    const { delegations, fromNameInfo } = await this.findAllIncoming(
      user,
      DelegationValidity.NOW,
    )

    const allowedScopes = await this.getClientAllowedScopes(user)

    const allowedDelegations = delegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeAllowed(s, allowedScopes),
        )
        return d
      })
      .filter(
        (d) =>
          // The requesting client must have access to at least one scope for the delegation to be relevant.
          d.delegationScopes && d.delegationScopes.length > 0,
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
    user: User,
    validity: DelegationValidity,
    domainName?: string,
  ): Promise<{ delegations: Delegation[]; fromNameInfo: IndividualDto[] }> {
    let whereOptions = getScopeValidityWhereClause(validity)
    if (domainName) whereOptions = { ...whereOptions, domainName: domainName }

    const delegations = await this.delegationModel.findAll({
      where: {
        toNationalId: user.nationalId,
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
    const {
      aliveDelegations,
      deceasedDelegations,
      fromNameInfo,
    } = await this.getLiveStatusFromDelegations(delegations)

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

  private checkIfScopeAllowed(
    scope: DelegationScope,
    allowedScopes: string[],
  ): boolean {
    return allowedScopes.includes(scope.scopeName)
  }

  private async getClientAllowedScopes(user: User) {
    return (
      await this.clientAllowedScopeModel.findAll({
        where: {
          clientId: user.client,
        },
      })
    ).map((s) => s.scopeName)
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
    fromNameInfo: IndividualDto[]
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
        ? null
        : this.nationalRegistryClient
            .getIndividual(fromNationalId)
            .catch(this.handlerGetIndividualError),
    )

    try {
      // Check if delegations is linked to a person, i.e. not deceased
      const persons = await Promise.all(delegationsPromises)
      const personsValuesNoError = persons
        .filter(this.isNotError)
        .filter(isDefined)

      // Divide delegations into alive or deceased delegations.
      const [aliveDelegations, deceasedDelegations] = partitionWithIndex(
        delegations,
        ({ fromNationalId }, index) =>
          // All companies will be divided into aliveDelegations
          kennitala.isCompany(fromNationalId) ||
          // Pass through altough Þjóðskrá API throws an error since it is not required to view the delegation.
          persons[index] instanceof Error ||
          // Make sure we can match the person to the delegation, i.e. not deceased
          (persons[index] as IndividualDto)?.nationalId === fromNationalId,
      )

      return {
        aliveDelegations,
        deceasedDelegations,
        fromNameInfo: personsValuesNoError,
      }
    } catch (error) {
      this.logger.error(
        `Error getting live status from delegations. Delegations: ${delegations.map(
          (d) => d.id,
        )}`,
        error,
      )

      // We do not want to fail the whole request if we cannot get the live status from delegations.
      // Therefore we return all delegations as alive delegations.
      return {
        aliveDelegations: delegations,
        deceasedDelegations: [],
        fromNameInfo: [],
      }
    }
  }

  private handlerGetIndividualError(error: null | Error) {
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
    persons: Array<IndividualDto | null>,
    nationalId: string,
  ) {
    return persons.find((person) => person?.nationalId === nationalId)
  }
}
