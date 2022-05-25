import type { AuthConfig, User } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import uniqBy from 'lodash/uniqBy'
import { Op, WhereOptions } from 'sequelize'
import { uuid } from 'uuidv4'

import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import type {
  EinstaklingarGetEinstaklingurRequest,
  EinstaklingarGetForsjaRequest,
} from '@island.is/clients/national-registry-v2'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import { UpdateDelegationScopeDTO } from '../entities/dto/delegation-scope.dto'
import {
  CreateDelegationDTO,
  DelegationDTO,
  DelegationProvider,
  DelegationType,
  UpdateDelegationDTO,
} from '../entities/dto/delegation.dto'
import { ApiScope } from '../entities/models/api-scope.model'
import { Client } from '../entities/models/client.model'
import { ClientAllowedScope } from '../entities/models/client-allowed-scope.model'
import { DelegationScope } from '../entities/models/delegation-scope.model'
import { Delegation } from '../entities/models/delegation.model'
import { PersonalRepresentativeService } from '../personal-representative'
import type { PersonalRepresentativeDTO } from '../personal-representative/entities/dto/personal-representative.dto'
import { DelegationValidity } from '../types/delegationValidity'
import { DelegationScopeService } from './delegationScope.service'
import { ResourcesService } from './resources.service'

type ClientDelegationInfo = Pick<
  Client,
  | 'supportsDelegation'
  | 'supportsLegalGuardians'
  | 'supportsProcuringHolders'
  | 'supportsPersonalRepresentatives'
>

export const DELEGATIONS_AUTH_CONFIG = 'DELEGATIONS_AUTH_CONFIG'

@Injectable()
export class DelegationsService {
  private readonly authFetch: EnhancedFetchAPI

  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScopeModel: typeof ClientAllowedScope,
    @Inject(DELEGATIONS_AUTH_CONFIG)
    private authConfig: AuthConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private rskProcuringClient: RskProcuringClient,
    private personApi: EinstaklingarApi,
    private delegationScopeService: DelegationScopeService,
    private featureFlagService: FeatureFlagService,
    private prService: PersonalRepresentativeService,
    private resourcesService: ResourcesService,
  ) {
    this.authFetch = createEnhancedFetch({ name: 'delegation-auth-client' })
  }

  /***** Outgoing Delegations *****/

  /**
   *
   * @param user The user that is giving the delegation to other user
   * @param createDelegation The delegation to create
   * @returns
   */
  async create(
    user: User,
    createDelegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    if (createDelegation.toNationalId === user.nationalId) {
      throw new BadRequestException(`Can not create delegation to self.`)
    }

    if (!(await this.validateScopesAccess(user, createDelegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!this.validateScopesPeriod(createDelegation.scopes)) {
      throw new BadRequestException(
        'When scope validTo property is provided it must be in the future',
      )
    }

    let delegation = await this.findByRelationship(
      user,
      createDelegation.toNationalId,
    )

    if (!delegation) {
      const [fromDisplayName, toName] = await Promise.all([
        this.getUserName(user),
        this.getPersonName(createDelegation.toNationalId),
      ])

      delegation = await this.delegationModel.create({
        id: uuid(),
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
        fromDisplayName,
        toName,
      })
    }

    // If createDelegation.scopes are empty then this will remove all the scopes the user has accesss to
    delegation.delegationScopes = await this.delegationScopeService.createOrUpdate(
      delegation.id,
      user.scope,
      createDelegation.scopes,
    )

    return delegation.toDTO()
  }

  /**
   * Updates a delegation between two users
   * @param user Authenticated user
   * @param input Scopes that the delegation should be updated with
   * @param delegationId Id of the delegation
   * @returns
   */
  async update(
    user: User,
    input: UpdateDelegationDTO,
    delegationId: string,
  ): Promise<DelegationDTO | null> {
    if (!(await this.validateScopesAccess(user, input.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!this.validateScopesPeriod(input.scopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    const delegation = await this.findById(user, delegationId)
    if (!delegation) {
      this.logger.debug('Delegation does not exists for user')
      throw new NotFoundException()
    }

    this.logger.debug(`Updating delegation ${delegation.id}`)

    await this.delegationScopeService.createOrUpdate(
      delegationId,
      user.scope,
      input.scopes,
    )

    return this.findById(user, delegationId)
  }

  /**
   * Deletes a delegation a user has given.
   * @param user User object of the authenticated user.
   * @param id Id of the delegation to delete
   * @returns
   */
  async delete(user: User, id: string): Promise<number> {
    this.logger.debug(`Deleting delegation ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    if (!delegation || delegation.fromNationalId !== user.nationalId) {
      this.logger.debug('Delegation does not exists or is not assigned to user')
      throw new NotFoundException()
    }

    return this.delegationScopeService.delete(id, user.scope)
  }

  /**
   * Finds a single delegation for a user.
   * @param nationalId Id of the user to find the delegation from.
   * @param id Id of the delegation to find.
   * @returns
   */
  async findById(user: User, id: string): Promise<DelegationDTO | null> {
    this.logger.debug(`Finding a delegation with id ${id}`)
    const delegation = await this.delegationModel.findOne({
      where: {
        id: id,
        [Op.or]: [
          { fromNationalId: user.nationalId },
          { toNationalId: user.nationalId },
        ],
      },
      include: [
        {
          model: DelegationScope,
          as: 'delegationScopes',
          required: false,
          where: this.getScopeValidWhereClause(
            DelegationValidity.INCLUDE_FUTURE,
          ),
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              where: {
                allowExplicitDelegationGrant: true,
              },
            },
          ],
        },
      ],
    })

    if (delegation) {
      delegation.delegationScopes = delegation.delegationScopes?.filter((s) =>
        this.checkIfScopeAllowed(s, user.scope),
      )
    }

    return delegation?.toDTO() || null
  }

  /**
   * Finds all delegations a user has created.
   * @param user Authenticated user
   * @param validity Enum values to indicate the validity of the scopes
   * @param otherUser The id of a user to find a specific delegation given to
   * @returns
   */
  async findAllOutgoing(
    user: User,
    validity: DelegationValidity,
    otherUser?: string,
  ): Promise<DelegationDTO[]> {
    const delegationWhere: { fromNationalId: string; toNationalId?: string } = {
      fromNationalId: user.nationalId,
    }

    if (otherUser) {
      delegationWhere.toNationalId = otherUser
    }

    const delegations = await this.delegationModel.findAll({
      where: delegationWhere,
      include: [
        {
          model: DelegationScope,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              where: {
                allowExplicitDelegationGrant: true,
              },
            },
          ],
          required: validity !== DelegationValidity.ALL,
          where: this.getScopeValidWhereClause(validity),
        },
      ],
    })

    // Make sure when using the otherUser filter that we only find one delegation
    if (otherUser && delegations && delegations.length > 1) {
      this.logger.error(
        `Invalid state of delegation. Found ${
          delegations.length
        } delegations for otherUser. Delegations: ${delegations.map(
          (d) => d.id,
        )}`,
      )
      throw new InternalServerErrorException(
        'Invalid state of delegation. User has two or more delegations with an other user.',
      )
    }

    return delegations
      .filter((d) =>
        // The user must have access to at least one scope in the delegation
        d.delegationScopes?.some((s) =>
          this.checkIfScopeAllowed(s, user.scope),
        ),
      )
      .map((d) => {
        // Filter out scopes the user does not have access to
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeAllowed(s, user.scope),
        )
        return d.toDTO()
      })
  }

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
        delegationTypes.includes(DelegationType.LegalGuardian))
    ) {
      delegationPromises.push(this.findAllWardsIncoming(user))
    }
    if (
      (!client || client.supportsProcuringHolders) &&
      (!hasDelegationTypeFilter ||
        delegationTypes.includes(DelegationType.ProcurationHolder))
    ) {
      delegationPromises.push(this.findAllCompaniesIncoming(user))
    }
    if (
      (!client || client.supportsDelegation) &&
      (!hasDelegationTypeFilter ||
        delegationTypes.includes(DelegationType.Custom))
    ) {
      delegationPromises.push(this.findAllValidCustomIncoming(user))
    }
    if (
      (!client || client.supportsPersonalRepresentatives) &&
      (!hasDelegationTypeFilter ||
        delegationTypes.includes(DelegationType.PersonalRepresentative))
    ) {
      delegationPromises.push(this.findAllRepresentedPersonsIncoming(user))
    }
    const delegationSets = await Promise.all(delegationPromises)

    return uniqBy(
      ([] as DelegationDTO[]).concat(...delegationSets),
      'fromNationalId',
    ).filter((delegation) => delegation.fromNationalId !== user.nationalId)
  }

  /**
   * Finds a delegation by relationship of two users
   * @param user Authenticated user that has given the delegation
   * @param toNationalId
   * @returns
   */
  private async findByRelationship(
    user: User,
    toNationalId: string,
  ): Promise<Delegation | null> {
    const today = startOfDay(new Date())
    const delegation = await this.delegationModel.findOne({
      where: {
        fromNationalId: user.nationalId,
        toNationalId: toNationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: false,
          where: {
            validTo: {
              [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: today }],
            },
          },
        },
      ],
    })

    if (delegation) {
      delegation.delegationScopes = delegation.delegationScopes?.filter((s) =>
        this.checkIfScopeAllowed(s, user.scope),
      )
    }

    return delegation
  }

  /***** Private helpers *****/
  /**
   * Find all wards for the user from NationalRegistry
   * @param user
   * @returns
   */
  private async findAllWardsIncoming(user: User): Promise<DelegationDTO[]> {
    try {
      const supported = await this.featureFlagService.getValue(
        Features.legalGuardianDelegations,
        false,
        user,
      )
      if (!supported) {
        return []
      }

      const response = await this.personApi
        .withMiddleware(new AuthMiddleware(user))
        .einstaklingarGetForsja({
          id: user.nationalId,
        })

      const distinct = response.filter(
        (r: string, i: number) => response.indexOf(r) === i,
      )

      const resultPromises = distinct.map(async (nationalId) =>
        this.personApi.einstaklingarGetEinstaklingur({
          id: nationalId,
        }),
      )

      const result = await Promise.all(resultPromises)

      return result.map(
        (p) =>
          <DelegationDTO>{
            toNationalId: user.nationalId,
            fromNationalId: p.kennitala,
            fromName: p.nafn,
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
      const feature = await this.featureFlagService.getValue(
        Features.companyDelegations,
        false,
        user,
      )
      if (!feature) {
        return []
      }

      const person = await this.rskProcuringClient.getSimple(user)

      if (person && person.companies) {
        return person.companies.map(
          (p) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: p.nationalId,
              fromName: p.name,
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
      const feature = await this.featureFlagService.getValue(
        Features.personalRepresentativeDelegations,
        false,
        user,
      )
      if (!feature) {
        return []
      }

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

      const rp = await this.prService.getByPersonalRepresentative(
        user.nationalId,
        false,
      )

      const resultPromises = rp.map(async (representative) =>
        this.personApi
          .einstaklingarGetEinstaklingur({
            id: representative.nationalIdRepresentedPerson,
          })
          .then(
            ({ nafn }) => toDelegationDTO(nafn, representative),
            () => toDelegationDTO('Óþekkt nafn', representative),
          ),
      )

      return await Promise.all(resultPromises)
    } catch (error) {
      this.logger.error('Error in findAllRepresentedPersons', error)
    }

    return []
  }

  /**
   * Finds all valid custom delegations given to user (Incoming delegations).
   * @param User.nationalId
   * @returns
   */
  private async findAllValidCustomIncoming(
    user: User,
  ): Promise<DelegationDTO[]> {
    const feature = await this.featureFlagService.getValue(
      Features.customDelegations,
      false,
      user,
    )
    if (!feature) {
      return []
    }

    const delegations = await this.delegationModel.findAll({
      where: {
        toNationalId: user.nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          where: this.getScopeValidWhereClause(DelegationValidity.NOW),
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

    return delegations
      .filter((d) =>
        d.delegationScopes?.some((s) =>
          this.checkIfScopeAllowed(s, allowedScopes),
        ),
      )
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeAllowed(s, user.scope),
        )
        return d.toDTO()
      })
  }

  /**
   * Constructs a where clause to use for DelegationScopes to filter
   * by a validity on the validFrom and validTo properties.
   * @param validity Controls the validFrom and validTo where clauses
   * @returns
   */
  private getScopeValidWhereClause(
    validity: DelegationValidity,
  ): WhereOptions | undefined {
    let scopesWhere: WhereOptions | undefined
    const startOfToday = startOfDay(new Date())
    const futureValidToWhere: WhereOptions = {
      // validTo > startOfToday OR validTo IS NULL
      validTo: {
        [Op.or]: {
          [Op.gte]: startOfToday,
          [Op.is]: null,
        },
      },
    }

    if (validity === DelegationValidity.NOW) {
      scopesWhere = {
        validFrom: { [Op.lte]: startOfToday },
        ...futureValidToWhere,
      }
    } else if (validity === DelegationValidity.INCLUDE_FUTURE) {
      scopesWhere = futureValidToWhere
    } else if (validity === DelegationValidity.PAST) {
      scopesWhere = {
        validTo: {
          [Op.lt]: startOfToday,
        },
      }
    }

    return scopesWhere
  }

  private checkIfScopeAllowed(
    scope: DelegationScope,
    allowedScopes: string[],
  ): boolean {
    return (
      (scope.scopeName && allowedScopes.includes(scope.scopeName)) ||
      (scope.identityResourceName &&
        allowedScopes.includes(scope.identityResourceName)) ||
      false
    )
  }

  private async getClientDelegationInfo(
    user: User,
  ): Promise<ClientDelegationInfo | null> {
    return this.clientModel.findByPk(user.client, {
      attributes: [
        'supportsLegalGuardians',
        'supportsProcuringHolders',
        'supportsDelegation',
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

  private async getUserName(user: User) {
    const response = await this.authFetch(
      `${this.authConfig.issuer}/connect/userinfo`,
      {
        headers: {
          Authorization: user.authorization,
        },
      },
    )
    const userinfo = (await response.json()) as { name: string }
    return userinfo.name
  }

  private async getPersonName(nationalId: string) {
    const person = await this.personApi.einstaklingarGetEinstaklingur({
      id: nationalId,
    })
    if (!person) {
      throw new BadRequestException(
        `A person with nationalId<${nationalId}> could not be found`,
      )
    }
    return person.fulltNafn || person.nafn
  }

  /**
   * Validates that the delegation scopes belong to user and are valid for delegation
   * @param user user scopes from the currently authenticated user
   * @param requestedScopes requested scopes from a delegation
   * @returns
   */
  private async validateScopesAccess(
    user: User,
    requestedScopes?: UpdateDelegationScopeDTO[],
  ): Promise<boolean> {
    if (!requestedScopes || requestedScopes.length === 0) {
      return true
    }

    for (const scope of requestedScopes) {
      // Delegation scopes need to be associated with the user scopes
      if (!user.scope.includes(scope.name)) {
        return false
      }
    }

    // Check if the requested scopes are valid
    const scopes = requestedScopes.map((scope) => scope.name)
    const allowedApiScopesCount = await this.resourcesService.countAllowedDelegationApiScopesForUser(
      scopes,
      user,
    )
    return requestedScopes.length === allowedApiScopesCount
  }

  /**
   * Validates the valid period of the scopes requested in a delegation.
   * @param scopes requested scopes on a delegation
   */
  private validateScopesPeriod(scopes?: UpdateDelegationScopeDTO[]): boolean {
    if (!scopes || scopes.length === 0) {
      return true
    }

    const startOfToday = startOfDay(new Date())
    // validTo needs to be the current day or in the future
    return scopes.every(
      (scope) => scope.validTo && new Date(scope.validTo) >= startOfToday,
    )
  }
}
