import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
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
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
    })
  }

  //TODO in progress
  async findRecyclingPartnerVehicles(
    companyId: string,
  ): Promise<RecyclingPartnerModel[]> {
    return this.recyclingPartnerModel.findAll({
      where: { companyId },
      include: [
        {
          model: this.recyclingRequestModel,
        },
      ],
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
