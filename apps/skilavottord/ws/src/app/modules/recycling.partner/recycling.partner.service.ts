import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingPartnerModel } from './model/recycling.partner.model'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByPartnerId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.debug(`Finding recycling partner by companyId - "${companyId}"`)
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
    })
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll()
    this.logger.debug(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async findActive(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
    this.logger.debug(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async createRecyclingPartner(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<boolean> {
    this.logger.debug(
      'Creating recycling partner:' + JSON.stringify(recyclingPartner, null, 2),
    )
    await recyclingPartner.save()
    return true
  }
}
