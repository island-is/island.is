import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import {
  CreateRecyclingPartnerInput,
  DeleteRecyclingPartnerInput,
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

  async createRecyclingPartner(
    input: CreateRecyclingPartnerInput,
  ): Promise<RecyclingPartnerModel> {
    return this.recyclingPartnerModel.create(input)
  }

  async updateRecyclingPartner({
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

  async deleteRecyclingPartner({
    companyId,
  }: DeleteRecyclingPartnerInput): Promise<Boolean> {
    const affectedRows = await this.recyclingPartnerModel.destroy({
      where: { companyId },
    })
    return affectedRows === 1
  }
}
