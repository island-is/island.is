import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
  ) {}

  async findByPartnerId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.info(`Finding recycling partner by companyId - "${companyId}"`)
    try {
      return await this.recyclingPartnerModel.findOne({
        where: { companyId },
      })
    } catch (error) {
      this.logger.error('error findByPartnerId:' + error)
    }
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    this.logger.info('find all recycling-partners...')
    try {
      const res = await this.recyclingPartnerModel.findAll()
      this.logger.info(
        'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding all recycling-partners:' + error)
    }
  }

  async findActive(): Promise<RecyclingPartnerModel[]> {
    this.logger.info('findActive recycling partner...')
    try {
      const res = await this.recyclingPartnerModel.findAll({
        where: { active: true },
      })
      this.logger.info(
        'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding active recycling partner:' + error)
    }
  }

  async createRecyclingPartner(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<boolean> {
    this.logger.info(
      'Creating recycling partner:' + JSON.stringify(recyclingPartner, null, 2),
    )
    try {
      await recyclingPartner.save()
      return true
    } catch (error) {
      this.logger.error('error creating recyclingpartner:' + error)
    }
  }
}
