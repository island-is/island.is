import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Delegation } from '../entities/models/delegation.model'

@Injectable()
export class DelegationsService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
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
    return [] // TODO: company registry
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
