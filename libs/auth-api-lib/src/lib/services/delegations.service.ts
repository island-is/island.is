import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import uniqBy from 'lodash/uniqBy'
import { Op, WhereOptions } from 'sequelize'
import { uuid } from 'uuidv4'

import {
  ApiScope,
  DelegationScope,
  IdentityResource,
  DelegationValidity,
} from '@island.is/auth-api-lib'
import {
  AuthMiddleware,
  AuthMiddlewareOptions,
} from '@island.is/auth-nest-tools'
import type { AuthConfig, User } from '@island.is/auth-nest-tools'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import type {
  EinstaklingarGetEinstaklingurRequest,
  EinstaklingarGetForsjaRequest,
} from '@island.is/clients/national-registry-v2'
import { RskApi } from '@island.is/clients/rsk/v2'
import type { CompaniesResponse } from '@island.is/clients/rsk/v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import {
  CreateDelegationDTO,
  DelegationDTO,
  DelegationProvider,
  DelegationType,
  UpdateDelegationDTO,
} from '../entities/dto/delegation.dto'
import { Delegation } from '../entities/models/delegation.model'
import { DelegationScopeService } from './delegationScope.service'

export const DELEGATIONS_AUTH_CONFIG = 'DELEGATIONS_AUTH_CONFIG'

@Injectable()
export class DelegationsService {
  private readonly authFetch: EnhancedFetchAPI

  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(DELEGATIONS_AUTH_CONFIG)
    private authConfig: AuthConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private rskApi: RskApi,
    private personApi: EinstaklingarApi,
    private delegationScopeService: DelegationScopeService,
    private featureFlagService: FeatureFlagService,
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
    return this.findById(user.nationalId, id)
  }

  /**
   * Updates a delegation between two users
   * @param fromNationalId Id of the user that is granting the delegation
   * @param input Scopes that the delegation should be updated with
   * @param delegationId Id of the delegation
   * @returns
   */
  async update(
    fromNationalId: string,
    input: UpdateDelegationDTO,
    delegationId: string,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.findById(fromNationalId, delegationId)
    if (!delegation) {
      this.logger.debug('Delegation does not exists for user')
      throw new NotFoundException()
    }

    this.logger.debug(`Updating delegation ${delegation.id}`)

    await this.delegationScopeService.delete(delegationId)
    if (input.scopes && input.scopes.length > 0) {
      await this.delegationScopeService.createMany(delegationId, input.scopes)
    }
    return this.findById(fromNationalId, delegationId)
  }

  /**
   * Deletes a delegation a user has given.
   * @param nationalId Id of the user who created the delegation to delete.
   * @param id Id of the delegation to delete
   * @returns
   */
  async delete(nationalId: string, id: string): Promise<number> {
    this.logger.debug(`Deleting delegation ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    if (!delegation || delegation.fromNationalId !== nationalId) {
      this.logger.debug('Delegation does not exists or is not assigned to user')
      throw new NotFoundException()
    }

    await this.delegationScopeService.delete(id)

    return this.delegationModel.destroy({
      where: { id: id, fromNationalId: nationalId },
    })
  }

  /**
   * Finds a single delegation for a user.
   * @param nationalId Id of the user to find the delegation from.
   * @param id Id of the delegation to find.
   * @returns
   */
  async findById(
    nationalId: string,
    id: string,
  ): Promise<DelegationDTO | null> {
    this.logger.debug(`Finding a delegation with id ${id}`)
    const delegation = await this.delegationModel.findOne({
      where: {
        id: id,
        [Op.or]: [{ fromNationalId: nationalId }, { toNationalId: nationalId }],
      },
      include: [
        {
          model: DelegationScope,
          as: 'delegationScopes',
          include: [{ model: ApiScope, as: 'apiScope' }],
        },
      ],
    })
    return delegation ? delegation.toDTO() : null
  }

  /**
   * Finds all delegations a user has created.
   * @param nationalId The id of the user to find all delegations from
   * @param isValid Flag to indicate if to filter by validTo to find only valid delegations
   * @returns
   */
  async findAllOutgoing(
    nationalId: string,
    valid: DelegationValidity,
    otherUser: string,
  ): Promise<DelegationDTO[]> {
    const delegationWhere: { fromNationalId: string; toNationalId?: string } = {
      fromNationalId: nationalId,
    }

    if (otherUser) {
      delegationWhere.toNationalId = otherUser
    }

    const delegations = await this.delegationModel.findAll({
      where: delegationWhere,
      include: [
        {
          model: DelegationScope,
          include: [ApiScope, IdentityResource],
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

    return delegations.map((delegation) => delegation.toDTO())
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
    const [wards, companies, custom] = await Promise.all([
      this.findAllWardsIncoming(user, authMiddlewareOptions),
      this.findAllCompaniesIncoming(user),
      this.findAllValidCustomIncoming(user),
    ])

    return uniqBy([...wards, ...companies, ...custom], 'fromNationalId').filter(
      (delegation) => delegation.fromNationalId !== user.nationalId,
    )
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
   * @param toNationalId
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

      const response: CompaniesResponse = await this.rskApi.apicompanyregistrymembersKennitalacompaniesGET1(
        { kennitala: user.nationalId },
      )

      if (response?.memberCompanies) {
        const companies = response.memberCompanies.filter(
          (m) => m.erProkuruhafi == '1',
        )

        if (companies.length > 0) {
          return companies.map(
            (p) =>
              <DelegationDTO>{
                toNationalId: user.nationalId,
                fromNationalId: p.kennitala,
                fromName: p.nafn,
                type: DelegationType.ProcurationHolder,
                provider: DelegationProvider.CompanyRegistry,
              },
          )
        }
      }
    } catch (error) {
      this.logger.error('Error in findAllCompanies', error)
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

    const result = await this.delegationModel.findAll({
      where: {
        toNationalId: user.nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          where: this.getScopeValidWhereClause(DelegationValidity.NOW),
        },
      ],
    })

    const filtered = result.filter(
      (x) => x.delegationScopes != null && x.delegationScopes.length > 0,
    )

    return filtered.map((d) => d.toDTO())
  }

  /**
   * Constructs a where clause to use for DelegationScopes to filter
   * by a validity on the validFrom and validTo properties.
   * @param valid Controls the validFrom and validTo where clauses
   * @returns
   */
  private getScopeValidWhereClause = (
    valid: DelegationValidity,
  ): WhereOptions | undefined => {
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
}
