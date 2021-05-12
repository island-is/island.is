import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Delegation } from '../entities/models/delegation.model'
import { RskApi, CompaniesResponse } from '@island.is/clients/rsk/v2'

@Injectable()
export class DelegationsService {
  constructor(
    @Inject(RskApi)
    private rskApi: RskApi,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
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
                isFromCompany: true,
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
        })\n${JSON.stringify(error.headers)}`,
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
          { validCount: { [Op.or]: [{ [Op.eq]: null }, { [Op.gt]: 0 }] } },
        ],
      },
    })

    return result.map(
      (d) =>
        <IDelegation>{
          toNationalId: d.toNationalId,
          fromNationalId: d.fromNationalId,
          fromName: d.fromDisplayName,
          isFromCompany: d.isFromCompany,
          type: DelegationType.Custom,
          provider: DelegationProvider.Custom,
        },
    )
  }
}

export interface IDelegation {
  toNationalId: string
  fromNationalId: string
  fromName: string
  isFromCompany: boolean
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
