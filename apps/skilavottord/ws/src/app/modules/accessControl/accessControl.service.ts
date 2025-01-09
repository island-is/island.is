import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { RecyclingPartnerModel } from '../recyclingPartner'

import {
  CreateAccessControlInput,
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'
import { AccessControlModel, AccessControlRole } from './accessControl.model'

@Injectable()
export class AccessControlService {
  constructor(
    @InjectModel(AccessControlModel)
    private accessControlModel: typeof AccessControlModel,
  ) {}

  async findAll(isDeveloper: boolean): Promise<AccessControlModel[]> {
    return this.accessControlModel.findAll({
      where: isDeveloper
        ? {}
        : { role: { [Op.not]: AccessControlRole.developer } },
      include: [
        {
          model: RecyclingPartnerModel,
        },
      ],
    })
  }

  async findByRecyclingPartner(
    partnerId: string,
  ): Promise<AccessControlModel[]> {
    let partnerIds = []

    // Get all sub recycling partners of the municipality
    // else get all
    if (partnerId) {
      const subRecyclingPartners = await RecyclingPartnerModel.findAll({
        where: { municipalityId: partnerId },
      })

      partnerIds = [
        partnerId,
        ...subRecyclingPartners.map((partner) => partner.companyId),
      ]
    } else {
      partnerIds = null
    }

    return this.accessControlModel.findAll({
      where: { partnerId: partnerIds },
      include: [RecyclingPartnerModel],
    })
  }

  async findOne(nationalId: string): Promise<AccessControlModel> {
    return this.accessControlModel.findOne({
      where: { nationalId },
      include: [
        {
          model: RecyclingPartnerModel,
        },
      ],
      raw: true,
    })
  }

  async createAccess(
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    return this.accessControlModel.create(input)
  }

  async updateAccess({
    nationalId,
    ...input
  }: UpdateAccessControlInput): Promise<AccessControlModel> {
    const [_, [accessControl]] = await this.accessControlModel.update(input, {
      where: { nationalId },
      returning: true,
    })
    return accessControl
  }

  async deleteAccess({
    nationalId,
  }: DeleteAccessControlInput): Promise<boolean> {
    const affectedRows = await this.accessControlModel.destroy({
      where: { nationalId },
    })
    return affectedRows === 1
  }
}
