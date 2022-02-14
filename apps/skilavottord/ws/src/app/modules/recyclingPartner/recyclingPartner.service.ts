import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import {
  CreateRecyclingPartnerInput,
  UpdateRecyclingPartnerInput,
} from './recyclingPartner.input'

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
