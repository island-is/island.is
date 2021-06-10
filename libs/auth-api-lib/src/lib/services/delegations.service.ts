import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { RskApi } from '@island.is/clients/rsk/v2'
import type { CompaniesResponse } from '@island.is/clients/rsk/v2'
import { uuid } from 'uuidv4'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import type {
  EinstaklingarGetForsjaRequest,
  EinstaklingarGetEinstaklingurRequest,
} from '@island.is/clients/national-registry-v2'
import { DelegationScope } from '@island.is/auth-api-lib'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth } from '@island.is/auth-nest-tools'

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

  async findAllWardsTo(
    auth: Auth,
    xRoadClient: string,
  ): Promise<DelegationDTO[]> {
    try {
      const response = await this.personApi
        .withMiddleware(new AuthMiddleware(auth, false))
        .einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
          id: auth.nationalId,
          xRoadClient: xRoadClient,
        })

      const distinct = response.filter(
        (r: string, i: number) => response.indexOf(r) === i,
      )

      const resultPromises = distinct.map(async (nationalId) =>
        this.personApi
          .withMiddleware(new AuthMiddleware(auth, false))
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
      this.logger.error(
        `Error in findAllWardsTo. Status: ${error?.status} (${
          error?.statusText
        })\n${JSON.stringify(error?.headers)}`,
      )
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
      this.logger.error(
        `Error in findAllCompaniesTo. Status: ${error?.status} (${
          error?.statusText
        })\n${JSON.stringify(error?.headers)}`,
      )
    }

    return []
  }

  async findAllValidCustomTo(toNationalId: string): Promise<DelegationDTO[]> {
    const now = new Date()

    const result = await this.delegationModel.findAll({
      where: {
        toNationalId: toNationalId,
      },
      include: [
        {
          model: DelegationScope,
          where: {
            [Op.and]: [
              { validFrom: { [Op.lt]: now } },
              { validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gt]: now }] } },
            ],
          },
        },
      ],
    })

    return result.map((d) => d.toDTO())
  }

  async create(
    nationalId: string,
    delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    this.logger.debug('Creating a new delegation')
    const id = uuid()
    await this.delegationModel.create({
      id: id,
      fromNationalId: nationalId,
      toNationalId: delegation.toNationalId,
      fromDisplayName: delegation.fromName,
    })
    if (delegation.scopes && delegation.scopes.length > 0) {
      this.delegationScopeService.createMany(id, delegation.scopes)
    }
    return this.findOne(nationalId, id)
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

    if (input.fromName) {
      await this.delegationModel.update(
        { fromDisplayName: input.fromName },
        { where: { id: delegation.id, fromNationalId: fromNationalId } },
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
    const delegation = await this.delegationModel.findOne({
      where: {
        toNationalId: toNationalId,
        fromNationalId: fromNationalId,
      },
      include: [DelegationScope],
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
      include: [DelegationScope],
    })
    return delegations.map((delegation) => delegation.toDTO())
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

  async deleteTo(nationalId: string, id: string): Promise<number> {
    this.logger.debug(`Deleting Delegation for Id ${id}`)

    const delegation = await this.delegationModel.findByPk(id)

    if (!delegation || delegation?.toNationalId !== nationalId) {
      this.logger.debug('Delegation is not assigned to user')
      throw new UnauthorizedException()
    }

    await this.delegationScopeService.delete(id)

    return this.delegationModel.destroy({
      where: { id: id, toNationalId: nationalId },
    })
  }
}
