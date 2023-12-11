import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as kennitala from 'kennitala'
import uniqBy from 'lodash/uniqBy'
import { Op } from 'sequelize'
import { isUuid } from 'uuidv4'

import type { User } from '@island.is/auth-nest-tools'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { Client } from '../clients/models/client.model'
import type { PersonalRepresentativeDTO } from '../personal-representative/dto/personal-representative.dto'
import { PersonalRepresentativeService } from '../personal-representative/services/personalRepresentative.service'
import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { ApiScope } from '../resources/models/api-scope.model'
import { ResourcesService } from '../resources/resources.service'
import { DEFAULT_DOMAIN } from '../types'
import { DelegationScopeService } from './delegation-scope.service'
import { DelegationDTO, DelegationProvider } from './dto/delegation.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationDirection } from './types/delegationDirection'
import { DelegationType } from './types/delegationType'
import { DelegationValidity } from './types/delegationValidity'
import { partitionWithIndex } from './utils/partitionWithIndex'
import { getScopeValidityWhereClause } from './utils/scopes'

export const UNKNOWN_NAME = 'Óþekkt nafn'

type ClientDelegationInfo = Pick<
  Client,
  | 'supportsCustomDelegation'
  | 'supportsLegalGuardians'
  | 'supportsProcuringHolders'
  | 'supportsPersonalRepresentatives'
>

@Injectable()
export class DelegationsService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScopeModel: typeof ClientAllowedScope,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    private rskProcuringClient: RskRelationshipsClient,
    private nationalRegistryClient: NationalRegistryClientService,
    private delegationScopeService: DelegationScopeService,
    private prService: PersonalRepresentativeService,
    private resourcesService: ResourcesService,
    private readonly auditService: AuditService,
    private readonly delegationResourcesService: DelegationResourcesService,
  ) {}

  /**
   * Finds a single delegation related to the user, either as a outgoing or incoming.
   * @param user Authenticated user object.
   * @param delegationId Id of the delegation to find.
   */
  async findById(user: User, delegationId: string): Promise<DelegationDTO> {
    if (!isUuid(delegationId)) {
      throw new BadRequestException('delegationId must be a valid uuid')
    }

    const delegation = await this.delegationModel.findOne({
      where: {
        id: delegationId,
        [Op.or]: [
          { fromNationalId: user.nationalId },
          { toNationalId: user.nationalId },
        ],
      },
      include: [
        {
          model: DelegationScope,
          required: false,
          include: [
            {
              model: ApiScope,
              attributes: ['displayName'],
            },
          ],
        },
      ],
    })

    const filteredDelegation = await this.filterDelegation(user, delegation)

    if (!filteredDelegation) {
      throw new NoContentException()
    }

    return filteredDelegation.toDTO()
  }

  private async filterDelegation(
    user: User,
    delegation: Delegation | null,
  ): Promise<Delegation | null> {
    let direction: DelegationDirection

    if (delegation?.fromNationalId === user.nationalId) {
      direction = DelegationDirection.OUTGOING
    } else if (delegation?.toNationalId === user.nationalId) {
      direction = DelegationDirection.INCOMING
    } else {
      return null
    }

    const allowedScopes = await this.delegationResourcesService.findScopeNames(
      user,
      delegation.domainName,
      direction,
    )
    // If the user doesn't have any allowed scope in the delegation domain we return null
    if (!allowedScopes.length) {
      return null
    }

    delegation.delegationScopes = delegation.delegationScopes?.filter((scope) =>
      allowedScopes.includes(scope.scopeName),
    )

    return delegation
  }

  /**
   * Deletes a delegation a user has given.
   * if direction is incoming is then all delegation scopes will be deleted else only user scopes
   * @param user User object of the authenticated user.
   * @param id Id of the delegation to delete
   * @returns
   */
  async delete(
    user: User,
    id: string,
    direction: DelegationDirection = DelegationDirection.OUTGOING,
  ): Promise<boolean> {
    this.logger.debug(`Deleting delegation ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    const isOutgoing = direction === DelegationDirection.OUTGOING
    const nationalId = isOutgoing
      ? delegation?.fromNationalId
      : delegation?.toNationalId

    if (!delegation || nationalId !== user.nationalId) {
      this.logger.debug('Delegation does not exists or is not assigned to user')
      throw new NotFoundException()
    }

    const customScopes = await this.apiScopeModel.findAll({
      attributes: ['name', 'customDelegationOnlyFor'],
      where: {
        customDelegationOnlyFor: {
          [Op.ne]: null,
        },
      },
    })

    await this.delegationScopeService.delete(
      id,
      isOutgoing
        ? user.scope.filter((scope) =>
            this.filterCustomScopeRule(scope, user, customScopes),
          )
        : null,
    )

    const remainingScopes =
      await this.delegationScopeService.findByDelegationId(id)

    // If no remaining scopes then we are save to delete the delegation
    if (remainingScopes.length === 0) {
      await this.delegationModel.destroy({
        where: { id },
      })
    }

    return true
  }

  /**
   * Deprecated: Use DelegationsIncomingService instead for incoming delegations.
   */
  /***** Incoming Delegations *****/

  /**
   * Finds all delegations given to user (Incoming delegations).
   * Includes custom delegations and natural delegations from
   * NationalRegistry and CompanyRegistry.
   * @param user
   * @returns
   */
  async findAllIncoming(
    user: User,
    delegationTypes?: DelegationType[],
  ): Promise<DelegationDTO[]> {
    const client = await this.getClientDelegationInfo(user)
    const delegationPromises = []

    const hasDelegationTypeFilter =
      delegationTypes && delegationTypes.length > 0

    if (
      (!client || client.supportsLegalGuardians) &&
      (!hasDelegationTypeFilter ||
        delegationTypes?.includes(DelegationType.LegalGuardian))
    ) {
      delegationPromises.push(this.findAllWardsIncoming(user))
    }
    if (
      (!client || client.supportsProcuringHolders) &&
      (!hasDelegationTypeFilter ||
        delegationTypes?.includes(DelegationType.ProcurationHolder))
    ) {
      delegationPromises.push(this.findAllCompaniesIncoming(user))
    }
    if (
      (!client || client.supportsCustomDelegation) &&
      (!hasDelegationTypeFilter ||
        delegationTypes?.includes(DelegationType.Custom))
    ) {
      delegationPromises.push(this.findAllValidCustomIncoming(user))
    }
    if (
      (!client || client.supportsPersonalRepresentatives) &&
      (!hasDelegationTypeFilter ||
        delegationTypes?.includes(DelegationType.PersonalRepresentative))
    ) {
      delegationPromises.push(this.findAllRepresentedPersonsIncoming(user))
    }

    const delegations = await Promise.all(delegationPromises)

    return uniqBy(delegations.flat(), 'fromNationalId').filter(
      (delegation) => delegation.fromNationalId !== user.nationalId,
    )
  }

  private handlerGetIndividualError(error: null | Error) {
    return error
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

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }

  /**
   * Divides delegations into alive and deceased delegations
   * - Makes calls for every delegation to NationalRegistry to check if the person exists.
   * - Divides the delegations into alive and deceased delegations, based on
   *   1. All companies will be divided into alive delegations.
   *   2. If the person exists in NationalRegistry, then the delegation is alive.
   */
  private async getLiveStatusFromDelegations(
    delegations: DelegationDTO[],
  ): Promise<{
    aliveDelegations: DelegationDTO[]
    deceasedDelegations: DelegationDTO[]
  }> {
    if (delegations.length === 0) {
      return {
        aliveDelegations: [],
        deceasedDelegations: [],
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

      const modifiedAliveDelegations = aliveDelegations.map(
        (aliveDelegation) => {
          const person = this.getPersonByNationalId(
            personsValuesNoError,
            aliveDelegation.fromNationalId,
          )

          return {
            ...aliveDelegation,
            fromName: person?.name ?? aliveDelegation.fromName ?? UNKNOWN_NAME,
          }
        },
      )

      return {
        aliveDelegations: modifiedAliveDelegations,
        deceasedDelegations,
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
      }
    }
  }

  /***** Private helpers *****/
  /**
   * Find all wards for the user from NationalRegistry
   * @param user
   * @returns
   */
  private async findAllWardsIncoming(user: User): Promise<DelegationDTO[]> {
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
              type: DelegationType.LegalGuardian,
              provider: DelegationProvider.NationalRegistry,
            },
        )
    } catch (error) {
      this.logger.error('Error in findAllWards', error)
    }

    return []
  }

  /**
   * Finds all companies that the user is procuration holder from CompanyRegistry
   * @param user.nationalId
   * @returns
   */
  private async findAllCompaniesIncoming(user: User): Promise<DelegationDTO[]> {
    try {
      const person = await this.rskProcuringClient.getIndividualRelationships(
        user,
      )

      if (person && person.relationships) {
        return person.relationships.map(
          (relationship) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: relationship.nationalId,
              fromName: relationship.name,
              type: DelegationType.ProcurationHolder,
              provider: DelegationProvider.CompanyRegistry,
            },
        )
      }
    } catch (error) {
      this.logger.error('Error in findAllCompanies', error)
    }

    return []
  }

  /**
   * Finds all represented persons the user is representing.
   * @param user Personal representative
   * @returns
   */
  private async findAllRepresentedPersonsIncoming(
    user: User,
  ): Promise<DelegationDTO[]> {
    try {
      const toDelegationDTO = (
        name: string,
        representative: PersonalRepresentativeDTO,
      ): DelegationDTO => ({
        toNationalId: representative.nationalIdPersonalRepresentative,
        fromNationalId: representative.nationalIdRepresentedPerson,
        fromName: name,
        type: DelegationType.PersonalRepresentative,
        provider: DelegationProvider.PersonalRepresentativeRegistry,
      })

      const personalRepresentatives =
        await this.prService.getByPersonalRepresentative({
          nationalIdPersonalRepresentative: user.nationalId,
        })

      const personPromises = personalRepresentatives.map(
        ({ nationalIdRepresentedPerson }) =>
          this.nationalRegistryClient
            .getIndividual(nationalIdRepresentedPerson)
            .catch(this.handlerGetIndividualError),
      )

      const persons = await Promise.all(personPromises)
      const personsValues = persons.filter((person) => person !== undefined)
      const personsValuesNoError = personsValues.filter(this.isNotError)

      // Divide personal representatives into alive or deceased.
      const [alive, deceased] = partitionWithIndex(
        personalRepresentatives,
        ({ nationalIdRepresentedPerson }, index) =>
          // Pass through altough Þjóðskrá API throws an error since it is not required to view the personal representative.
          persons[index] instanceof Error ||
          // Make sure we can match the person to the personal representatives, i.e. not deceased
          (persons[index] as IndividualDto)?.nationalId ===
            nationalIdRepresentedPerson,
      )

      if (deceased.length > 0) {
        await this.makePersonalRepresentativesInactive(deceased)
      }

      return alive
        .map((pr) => {
          const person = this.getPersonByNationalId(
            personsValuesNoError,
            pr.nationalIdRepresentedPerson,
          )

          return toDelegationDTO(person?.name ?? UNKNOWN_NAME, pr)
        })
        .filter(isDefined)
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

  /**
   * Finds all valid custom delegations given to user (Incoming delegations).
   * @param User.nationalId
   * @returns
   */
  private async findAllValidCustomIncoming(
    user: User,
  ): Promise<DelegationDTO[]> {
    const delegations = await this.delegationModel.findAll({
      where: {
        toNationalId: user.nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          where: getScopeValidityWhereClause(DelegationValidity.NOW),
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              required: true,
              where: {
                allowExplicitDelegationGrant: true,
              },
            },
          ],
        },
      ],
    })

    const allowedScopes = await this.getClientAllowedScopes(user)

    const delegationModels = delegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfIncomingScopeAllowed(s, allowedScopes),
        )
        return d.toDTO()
      })
      .filter(
        (d) =>
          // The requesting client must have access to at least one scope for the delegation to be relevant.
          d.scopes && d.scopes.length > 0,
      )

    // Check live status, i.e. dead or alive for delegations
    const { aliveDelegations, deceasedDelegations } =
      await this.getLiveStatusFromDelegations(delegationModels)

    if (deceasedDelegations.length > 0) {
      // Delete all deceased delegations by deleting them and their scopes.
      const deletePromises = deceasedDelegations
        .map(({ id }) =>
          id ? this.delete(user, id, DelegationDirection.INCOMING) : undefined,
        )
        .filter(isDefined)

      await Promise.all(deletePromises)

      this.auditService.audit({
        action: 'deleteDelegationsForMissingPeople',
        resources: deceasedDelegations.map(({ id }) => id).filter(isDefined),
        system: true,
      })
    }

    return aliveDelegations.filter((d) => d.domainName === DEFAULT_DOMAIN)
  }

  private checkIfIncomingScopeAllowed(
    scope: DelegationScope,
    allowedScopes: string[],
  ): boolean {
    return allowedScopes.includes(scope.scopeName)
  }

  private filterCustomScopeRule(
    scope: string,
    user: User,
    customScopes: ApiScope[],
  ): boolean {
    const customRule = customScopes.find((rule) => rule.name === scope)

    return (
      !customRule?.customDelegationOnlyFor ||
      customRule.customDelegationOnlyFor.some((type) =>
        user.delegationType?.includes(type as unknown as AuthDelegationType),
      )
    )
  }

  private async getClientDelegationInfo(
    user: User,
  ): Promise<ClientDelegationInfo | null> {
    return this.clientModel.findByPk(user.client, {
      attributes: [
        'supportsLegalGuardians',
        'supportsProcuringHolders',
        'supportsCustomDelegation',
        'supportsPersonalRepresentatives',
      ],
    })
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
}
