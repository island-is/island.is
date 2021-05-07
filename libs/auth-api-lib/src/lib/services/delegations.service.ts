import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Delegation } from '../entities/models/delegation.model'
import { RskApi, CompaniesResponse } from '@island.is/clients/rsk/v2'
import { DelegationDTO } from '../entities/dto/delegation.dto'
import { uuid } from 'uuidv4'
import { DelegationScopeService } from './delegation-scope.service'
import { DelegationScope } from '@island.is/auth-api-lib'

@Injectable()
export class DelegationsService {
  constructor(
    @Inject(RskApi)
    private rskApi: RskApi,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(DelegationScopeService)
    private delegationScopeService: DelegationScopeService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllTo(toNationalId: string): Promise<IDelegation[]> {
    const wards = await this.findAllWardsTo(toNationalId)

    const companies = await this.findAllCompaniesTo(toNationalId)

    const custom = await this.findAllValidCustomTo(toNationalId)

    return [...wards, ...companies, ...custom]
  }

  async findAllWardsTo(toNationalId: string): Promise<IDelegation[]> {
    return [] // TODO: national registry
  }

  async findAllCompaniesTo(toNationalId: string): Promise<IDelegation[]> {
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
              <IDelegation>{
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
        `Error in findAllCompaniesTo. Status: ${error.status} (${
          error.statusText
        })\n${JSON.stringify(error.headers._headers)}`,
      )
    }

    return []
  }

  async findAllValidCustomTo(toNationalId: string): Promise<IDelegation[]> {
    const now = new Date()

    const result = await this.delegationModel.findAll({
      where: {
        [Op.and]: [
          { toNationalId: toNationalId },
          { validFrom: { [Op.lt]: now } },
          { validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gt]: now }] } },
        ],
      },
    })

    return result.map(
      (d) =>
        <IDelegation>{
          toNationalId: d.toNationalId,
          fromNationalId: d.fromNationalId,
          fromName: d.fromDisplayName,
          type: DelegationType.Custom,
          provider: DelegationProvider.Custom,
        },
    )
  }

  async create(
    nationalId: string,
    delegation: DelegationDTO,
  ): Promise<Delegation | null> {
    this.logger.debug('Creating a new delegation')
    const id = uuid()
    await this.delegationModel.create({
      id: id,
      fromNationalId: nationalId,
      ...delegation,
    })
    if (delegation.scopes) {
      this.delegationScopeService.createMany(id, delegation.scopes)
    }
    return this.findOne(nationalId, id)
  }

  async update(
    nationalId: string,
    delegation: DelegationDTO,
    id: string,
  ): Promise<Delegation | null> {
    this.logger.debug(`Updating a delegation with id ${id}`)
    await this.delegationModel.update(
      { ...delegation },
      { where: { id: id, fromNationalId: nationalId } },
    )
    await this.delegationScopeService.delete(id)
    if (delegation.scopes) {
      await this.delegationScopeService.createMany(id, delegation.scopes)
    }
    return this.findOne(nationalId, id)
  }

  async findOne(nationalId: string, id: string): Promise<Delegation | null> {
    this.logger.debug(`Finding a delegation with id ${id}`)
    return await this.delegationModel.findOne({
      where: {
        id: id,
        fromNationalId: nationalId,
      },
      include: [DelegationScope],
    })
  }

  async findAllCustomTo(nationalId: string): Promise<Delegation[] | null> {
    this.logger.debug(`Finding a delegation for nationalId ${nationalId}`)
    return await this.delegationModel.findAll({
      where: {
        toNationalId: nationalId,
      },
      include: [DelegationScope],
    })
  }

  async findAllCustomFrom(nationalId: string): Promise<Delegation[] | null> {
    this.logger.debug(`Finding a delegation for nationalId ${nationalId}`)
    return await this.delegationModel.findAll({
      where: {
        fromNationalId: nationalId,
      },
      include: [DelegationScope],
    })
  }

  async deleteFrom(nationalId: string, id: string): Promise<number> {
    this.logger.debug(`Deleting Delegation for Id ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    if (!delegation || delegation?.fromNationalId !== nationalId) {
      this.logger.debug('Delegation does is not assigned to user')
      return 0
    }

    await this.delegationScopeService.delete(id)

    const response = this.delegationModel.destroy({
      where: { id: id, fromNationalId: nationalId },
    })

    return response
  }

  async deleteTo(nationalId: string, id: string): Promise<number> {
    this.logger.debug(`Deleting Delegation for Id ${id}`)

    const delegation = await this.delegationModel.findByPk(id)

    if (!delegation || delegation?.toNationalId !== nationalId) {
      this.logger.debug('Delegation does is not assigned to user')
      return 0
    }

    await this.delegationScopeService.delete(id)

    const response = this.delegationModel.destroy({
      where: { id: id, toNationalId: nationalId },
    })

    return response
  }
}

export interface IDelegation {
  toNationalId: string
  fromNationalId: string
  fromName: string
  type: DelegationType
  provider: DelegationProvider
}

enum DelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  Custom = 'Custom',
}

enum DelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  Custom = 'delegationdb',
}
