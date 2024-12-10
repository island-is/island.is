import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import {
  CreateRecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'
import { Op } from 'sequelize'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
  ) {}

  async findAll(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerModel.findAll()
  }

  async findAllActive(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
  }

  async findAllRecyclingPartnersByType(
    isMunicipality: boolean,
    municipalityId: string | null,
  ): Promise<RecyclingPartnerModel[]> {
    // If Role.municipality, return all recycling partners that are not municipalities
    if (municipalityId) {
      return await this.recyclingPartnerModel.findAll({
        where: {
          isMunicipality: false,
          municipalityId: municipalityId,
        },
      })
    }

    if (isMunicipality) {
      return await this.recyclingPartnerModel.findAll({
        where: { isMunicipality: true },
      })
    }
    return await this.recyclingPartnerModel.findAll({
      where: {
        [Op.or]: [{ isMunicipality: false }, { isMunicipality: null }],
      },
    })
  }

  async findOne(companyId: string): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
      raw: true,
    })
  }

  async create(
    input: CreateRecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerModel.create(input)
  }

  async update({
    companyId,
    ...input
  }: UpdateRecyclingPartnerInput): Promise<RecyclingPartnerModel> {
    const [_, [accessControl]] = await this.recyclingPartnerModel.update(
      input,
      {
        where: { companyId },
        returning: true,
      },
    )
    return accessControl
  }
}
