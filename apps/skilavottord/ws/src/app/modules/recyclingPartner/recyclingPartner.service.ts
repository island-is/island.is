import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { RecyclingPartnerModel } from './recyclingPartner.model'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByPartnerId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.info(`Finding recyclingPartner by companyId - "${companyId}"`)
    try {
      return await this.recyclingPartnerModel.findOne({
        where: { companyId },
      })
    } catch (error) {
      this.logger.error('error findByPartnerId:' + error)
    }
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    this.logger.info('find all recyclingPartners...')
    try {
      const res = await this.recyclingPartnerModel.findAll()
      this.logger.info(
        'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding all recyclingPartners:' + error)
    }
  }

  async findActive(): Promise<RecyclingPartnerModel[]> {
    this.logger.info('findActive recyclingPartner...')
    try {
      const res = await this.recyclingPartnerModel.findAll({
        where: { active: true },
      })
      this.logger.info(
        'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding active recyclingPartner:' + error)
    }
  }

  async createRecyclingPartner(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<boolean> {
    this.logger.info(
      'Creating recyclingPartner:' + JSON.stringify(recyclingPartner, null, 2),
    )
    try {
      await recyclingPartner.save()
      return true
    } catch (error) {
      this.logger.error('error creating recyclingpartner:' + error)
    }
  }
}
