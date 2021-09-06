import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import uniqBy from 'lodash/uniqBy'
import { uuid } from 'uuidv4'
import startOfDay from 'date-fns/startOfDay'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RskApi } from '@island.is/clients/rsk/v2'
import type { CompaniesResponse } from '@island.is/clients/rsk/v2'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import type {
  EinstaklingarGetForsjaRequest,
  EinstaklingarGetEinstaklingurRequest,
} from '@island.is/clients/national-registry-v2'
import {
  DelegationScope,
  ApiScope,
  IdentityResource,
} from '@island.is/auth-api-lib'
import type { Auth, User } from '@island.is/auth-nest-tools'
import {
  AuthMiddleware,
  AuthMiddlewareOptions,
} from '@island.is/auth-nest-tools'

import {
  DelegationDTO,
  DelegationProvider,
  DelegationType,
  UpdateDelegationDTO,
  CreateDelegationDTO,
} from '../entities/dto/delegation.dto'
import { Delegation } from '../entities/models/delegation.model'
import { DelegationScopeService } from './delegation-scope.service'

@Injectable()
export class DelegationsService {
  constructor(
    @Inject(RskApi)
    private rskApi: RskApi,
    @Inject(EinstaklingarApi)
    private personApi: EinstaklingarApi,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(DelegationScopeService)
    private delegationScopeService: DelegationScopeService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllTo(
    user: User,
    xRoadClient: string,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<DelegationDTO[]> {
    const [wards, companies, custom] = await Promise.all([
      this.findAllWardsTo(user, xRoadClient, authMiddlewareOptions),
      this.findAllCompaniesTo(user.nationalId),
      this.findAllValidCustomTo(user.nationalId),
    ])

    return uniqBy([...wards, ...companies, ...custom], 'fromNationalId')
  }

  async findAllWardsTo(
    auth: Auth,
    xRoadClient: string,
    authMiddlewareOptions: AuthMiddlewareOptions,
  ): Promise<DelegationDTO[]> {
    try {
      this.logger.info(`findAllWardsTo: -${auth.nationalId?.substring(6, 10)}`)
      const response = await this.personApi
        .withMiddleware(new AuthMiddleware(auth, authMiddlewareOptions))
        .einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
          id: auth.nationalId,
          xRoadClient: xRoadClient,
        })

      const distinct = response.filter(
        (r: string, i: number) => response.indexOf(r) === i,
      )

      const resultPromises = distinct.map(async (nationalId) =>
        this.personApi
          .withMiddleware(new AuthMiddleware(auth, authMiddlewareOptions))
          .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
            id: nationalId,
            xRoadClient: xRoadClient,
          }),
      )

      const result = await Promise.all(resultPromises)

      return result.map(
        (p) =>
          <DelegationDTO>{
            toNationalId: auth.nationalId,
            fromNationalId: p.kennitala,
            fromName: p.nafn,
            type: DelegationType.LegalGuardian,
            provider: DelegationProvider.NationalRegistry,
          },
      )
    } catch (error) {
      this.logger.error('Error in findAllWardsTo', error)
    }

    return []
  }

  async findAllCompaniesTo(toNationalId: string): Promise<DelegationDTO[]> {
    try {
      const response: CompaniesResponse = await this.rskApi.apicompanyregistrymembersKennitalacompaniesGET1(
        { kennitala: toNationalId },
      )

      if (response?.memberCompanies) {
        const companies = response.memberCompanies.filter(
          (m) => m.erProkuruhafi == '1',
        )

        if (Array.isArray(companies) && companies.length > 0) {
          return companies.map(
            (p) =>
              <DelegationDTO>{
                toNationalId: toNationalId,
                fromNationalId: p.kennitala,
                fromName: p.nafn,
                type: DelegationType.ProcurationHolder,
                provider: DelegationProvider.CompanyRegistry,
              },
          )
        }
      }
    } catch (error) {
      this.logger.error('Error in findAllCompaniesTo', error)
    }

    return []
  }

  async findAllValidCustomTo(toNationalId: string): Promise<DelegationDTO[]> {
    const today = startOfDay(new Date())

    const result = await this.delegationModel.findAll({
      where: {
        toNationalId: toNationalId,
      },
      include: [
        {
          model: DelegationScope,
          where: {
            [Op.and]: [
              { validFrom: { [Op.lte]: today } },
              {
                validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: today }] },
              },
            ],
          },
        },
      ],
    })

    const filtered = result.filter(
      (x) => x.delegationScopes !== null && x.delegationScopes!.length > 0,
    )

    return filtered.map((d) => d.toDTO())
  }

  async create(
    user: Auth,
    xRoadClient: string,
    authMiddlewareOptions: AuthMiddlewareOptions,
    delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    const person = await this.personApi
      .withMiddleware(
        new AuthMiddleware(user, {
          forwardUserInfo: authMiddlewareOptions.forwardUserInfo,
        }),
      )
      .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
        id: user.nationalId,
        xRoadClient: xRoadClient,
      })
    if (!person || !user.nationalId) {
      throw new BadRequestException(
        `A person with nationalId<${user.nationalId}> could not be found`,
      )
    }

    this.logger.debug('Creating a new delegation')
    const id = uuid()
    await this.delegationModel.create({
      id: id,
      fromNationalId: user.nationalId,
      toNationalId: delegation.toNationalId,
      fromDisplayName: person.fulltNafn || person.nafn,
      toName: delegation.toName,
    })
    if (delegation.scopes && delegation.scopes.length > 0) {
      this.delegationScopeService.createMany(id, delegation.scopes)
    }
    return this.findOne(user.nationalId, id)
  }

  async update(
    fromNationalId: string,
    input: UpdateDelegationDTO,
    toNationalId: string,
  ): Promise<DelegationDTO | null> {
    this.logger.debug(
      `Updating a delegation with from ${fromNationalId} to ${toNationalId}`,
    )

    const delegation = await this.findOneTo(fromNationalId, toNationalId)
    if (!delegation) {
      this.logger.debug('Delegation is not assigned to user')
      throw new UnauthorizedException()
    }

    if (input.toName) {
      await this.delegationModel.update(
        { toName: input.toName },
        { where: { id: delegation.id } },
      )
    }

    if (input.scopes) {
      await this.delegationScopeService.delete(delegation.id)
      if (input.scopes) {
        await this.delegationScopeService.createMany(
          delegation.id,
          input.scopes,
        )
      }
    }
    return this.findOne(fromNationalId, delegation.id)
  }

  async findOne(nationalId: string, id: string): Promise<DelegationDTO | null> {
    this.logger.debug(`Finding a delegation with id ${id}`)
    const delegation = await this.delegationModel.findOne({
      where: {
        id: id,
        fromNationalId: nationalId,
      },
      include: [DelegationScope],
    })
    return delegation ? delegation.toDTO() : null
  }

  async findOneTo(
    fromNationalId: string,
    toNationalId: string,
  ): Promise<Delegation | null> {
    this.logger.debug(
      `Finding a delegation with from ${fromNationalId} to ${toNationalId}`,
    )

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

  async findAllCustomTo(nationalId: string): Promise<DelegationDTO[] | null> {
    this.logger.debug(`Finding a delegation for nationalId ${nationalId}`)
    const delegations = await await this.delegationModel.findAll({
      where: {
        toNationalId: nationalId,
      },
      include: [DelegationScope],
    })
    return delegations.map((delegation) => delegation.toDTO())
  }

  async findAllCustomFrom(nationalId: string): Promise<DelegationDTO[] | null> {
    this.logger.debug(`Finding a delegation for nationalId ${nationalId}`)
    const delegations = await this.delegationModel.findAll({
      where: {
        fromNationalId: nationalId,
      },
      include: [
        { model: DelegationScope, include: [ApiScope, IdentityResource] },
      ],
    })
    return delegations.map((delegation) => delegation.toDTO())
  }

  async findAllValidCustomFrom(nationalId: string): Promise<DelegationDTO[]> {
    const today = startOfDay(new Date())

    const result = await this.delegationModel.findAll({
      where: {
        fromNationalId: nationalId,
      },
      include: [
        {
          model: DelegationScope,
          include: [ApiScope, IdentityResource],
          where: {
            validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: today }] },
          },
        },
      ],
    })

    const filtered = result.filter(
      (x) => x.delegationScopes !== null && x.delegationScopes!.length > 0,
    )

    return filtered.map((d) => d.toDTO())
  }

  async deleteFrom(nationalId: string, id: string): Promise<number> {
    this.logger.debug(`Deleting Delegation for Id ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    if (!delegation || delegation?.fromNationalId !== nationalId) {
      this.logger.debug('Delegation is not assigned to user')
      throw new UnauthorizedException()
    }

    await this.delegationScopeService.delete(id)

    return this.delegationModel.destroy({
      where: { id: id, fromNationalId: nationalId },
    })
  }

  async deleteTo(
    fromNationalId: string,
    toNationalId: string,
  ): Promise<number> {
    this.logger.debug(
      `Deleting a delegation with from ${fromNationalId} to ${toNationalId}`,
    )

    const delegation = await this.findOneTo(fromNationalId, toNationalId)
    if (!delegation) {
      this.logger.debug('Delegation is not assigned to user')
      throw new UnauthorizedException()
    }

    await this.delegationScopeService.delete(delegation.id)

    return this.delegationModel.destroy({
      where: { id: delegation.id },
    })
  }
}
