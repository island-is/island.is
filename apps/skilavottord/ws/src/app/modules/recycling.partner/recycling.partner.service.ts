import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { logger, Logger, LOGGER_PROVIDER } from '@island.is/logging'
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

  static createDefaultRecyclingPartner(): void {
    logger.debug('.......START INSIDE STATIC.........')
    const defaultRp = new RecyclingPartnerModel()
    defaultRp.companyId = '0000000000'
    defaultRp.companyName = 'unknown'
    defaultRp.save()
    logger.debug('.......END INSIDE STATIC.........')
  }

  async findByPartnerId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.info(`Finding recycling partner by companyId - "${companyId}"`)
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
    })
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll()
    this.logger.info(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async findActive(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
    this.logger.info(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async createRecyclingPartner(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<boolean> {
    this.logger.info(
      'Creating recycling partner:' + JSON.stringify(recyclingPartner, null, 2),
    )
    await recyclingPartner.save()
    return true
  }
}
