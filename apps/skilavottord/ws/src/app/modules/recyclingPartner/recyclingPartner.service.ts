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
    return await this.recyclingPartnerModel.findAll({
      where: {
        [Op.or]: [{ isMunicipality: false }, { isMunicipality: null }],
      },
    })
  }

  async findAllActive(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
  }

  async findAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerModel.findAll({
      where: { isMunicipality: true },
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
