import type { AuthConfig, User } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  ConflictException,
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

import {
  AuthMiddleware,
  AuthMiddlewareOptions,
} from '@island.is/auth-nest-tools'
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
import { ClientAllowedScope } from '../entities/models/client-allowed-scope.model'
import { DelegationScope } from '../entities/models/delegation-scope.model'
import { Delegation } from '../entities/models/delegation.model'
import { PersonalRepresentativeService } from '../personal-representative'
import type { PersonalRepresentativeDTO } from '../personal-representative/entities/dto/personal-representative.dto'
import { DelegationValidity } from '../types/delegationValidity'
import { DelegationScopeService } from './delegationScope.service'
import { ResourcesService } from './resources.service'

export const DELEGATIONS_AUTH_CONFIG = 'DELEGATIONS_AUTH_CONFIG'

@Injectable()
export class DelegationsService {
  private readonly authFetch: EnhancedFetchAPI

  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
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
   * @param delegation The delegation to create
   * @param xRoadClient
   * @param authMiddlewareOptions
   * @returns
   */
  async create(
    user: User,
    delegation: CreateDelegationDTO,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<DelegationDTO | null> {
    if (delegation.toNationalId === user.nationalId) {
      throw new BadRequestException(`Can not create delegation to self.`)
    }

    if (!(await this.validateScopesAccess(user, delegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!this.validateScopesPeriod(delegation.scopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    if (
      await this.findByRelationship(user.nationalId, delegation.toNationalId)
    ) {
      throw new ConflictException(
        'Delegation exists. Please use PUT method to update.',
      )
    }

    const [fromDisplayName, toName] = await Promise.all([
      this.getUserName(user),
      this.getPersonName(delegation.toNationalId, user, authMiddlewareOptions),
    ])

    this.logger.debug('Creating a new delegation')
    const id = uuid()
    await this.delegationModel.create({
      id,
      fromNationalId: user.nationalId,
      toNationalId: delegation.toNationalId,
      fromDisplayName,
      toName,
    })
    if (delegation.scopes && delegation.scopes.length > 0) {
      await this.delegationScopeService.createMany(id, delegation.scopes)
    }
    return this.findById(user, id)
  }

  /**
   * Updates a delegation between two users
   * @param fromNationalId Id of the user that is granting the delegation
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

    await this.delegationScopeService.delete(delegationId, user.scope)
    if (input.scopes && input.scopes.length > 0) {
      await this.delegationScopeService.createMany(delegationId, input.scopes)
    }
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
   * @param valid Filter which scopes to return.
   * @returns
   */
  async findById(
    user: User,
    id: string,
    valid = DelegationValidity.ALL,
  ): Promise<DelegationDTO | null> {
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
          where: this.getScopeValidWhereClause(valid),
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
   * @param nationalId The id of the user to find all delegations from
   * @param isValid Flag to indicate if to filter by validTo to find only valid delegations
   * @param otherUser The id of a user to find a specific delegation given to
   * @returns
   */
  async findAllOutgoing(
    user: User,
    valid: DelegationValidity,
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
          required: valid !== DelegationValidity.ALL,
          where: this.getScopeValidWhereClause(valid),
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
      .filter(
        (d) =>
          // Allow empty scopes if otherUser is set
          otherUser ||
          // Allow empty scopes if date validation or explicit grant filtered out scopes
          !d.delegationScopes ||
          d.delegationScopes.length < 1 ||
          // Otherwise the user must have at least access to one of the scopes
          d.delegationScopes.some((s) =>
            this.checkIfScopeAllowed(s, user.scope),
          ),
      )
      .map((d) => {
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
   * @param xRoadClient
   * @param authMiddlewareOptions
   * @returns
   */
  async findAllIncoming(
    user: User,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<DelegationDTO[]> {
    const [wards, companies, custom, represented] = await Promise.all([
      this.findAllWardsIncoming(user, authMiddlewareOptions),
      this.findAllCompaniesIncoming(user),
      this.findAllValidCustomIncoming(user),
      this.findAllRepresentedPersonsIncoming(user, authMiddlewareOptions),
    ])

    return uniqBy(
      [...wards, ...companies, ...custom, ...represented],
      'fromNationalId',
    ).filter((delegation) => delegation.fromNationalId !== user.nationalId)
  }

  /**
   * Finds a delegation by relationship of two users
   * @param fromNationalId
   * @param toNationalId
   * @returns
   */
  async findByRelationship(
    fromNationalId: string,
    toNationalId: string,
  ): Promise<Delegation | null> {
    const today = startOfDay(new Date())
    const delegation = await this.delegationModel.findOne({
      where: {
        toNationalId: toNationalId,
        fromNationalId: fromNationalId,
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

    return delegation
  }

  /***** Private helpers *****/
  /**
   * Find all wards for the user from NationalRegistry
   * @param user
   * @param xRoadClient
   * @param authMiddlewareOptions
   * @returns
   */
  private async findAllWardsIncoming(
    user: User,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<DelegationDTO[]> {
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
        .withMiddleware(new AuthMiddleware(user, authMiddlewareOptions))
        .einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
          id: user.nationalId,
        })

      const distinct = response.filter(
        (r: string, i: number) => response.indexOf(r) === i,
      )

      const resultPromises = distinct.map(async (nationalId) =>
        this.personApi
          .withMiddleware(new AuthMiddleware(user, authMiddlewareOptions))
          .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
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
    authMiddlewareOptions: AuthMiddlewareOptions,
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
          .withMiddleware(new AuthMiddleware(user, authMiddlewareOptions))
          .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
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

    //return this.transformAndFilter(results, user, DelegationDirection.INCOMING)
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
   * @param valid Controls the validFrom and validTo where clauses
   * @returns
   */
  private getScopeValidWhereClause(
    valid: DelegationValidity,
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

    if (valid === DelegationValidity.NOW) {
      scopesWhere = {
        validFrom: { [Op.lte]: startOfToday },
        ...futureValidToWhere,
      }
    } else if (valid === DelegationValidity.INCLUDE_FUTURE) {
      scopesWhere = futureValidToWhere
    } else if (valid === DelegationValidity.PAST) {
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

  private async getPersonName(
    nationalId: string,
    user: User,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ) {
    const person = await this.personApi
      .withMiddleware(
        new AuthMiddleware(user, {
          forwardUserInfo: authMiddlewareOptions.forwardUserInfo,
        }),
      )
      .einstaklingarGetEinstaklingur({
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
    // validTo can be null or undefined or it needs to be the current day or in the future
    return scopes.every(
      (scope) => !scope.validTo || new Date(scope.validTo) >= startOfToday,
    )
  }
}
