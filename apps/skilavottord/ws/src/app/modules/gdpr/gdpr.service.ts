import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GdprModel } from './model/gdpr.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class GdprService {
  constructor(
    @InjectModel(GdprModel)
    private gdprModel: typeof GdprModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findByNationalId(nationalId: string): Promise<GdprModel> {
    this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
    return this.gdprModel.findOne({
      where: { nationalId },
    })
  }

  insertNewGdpr(nationalId: string, gdprStatus: string) {
    this.logger.debug(
      `Insert gdpr nationalId:${nationalId} gdprStatus: ${gdprStatus}`,
    )
    const newGdpr: GdprModel = new GdprModel()
    newGdpr.nationalId = nationalId
    newGdpr.gdprStatus = gdprStatus
    newGdpr.save()
  }

  async findAll(): Promise<GdprModel[]> {
    return await this.gdprModel.findAll()
  }

  // async create(gdpr: Gdpr): Promise<Gdpr> {
  //   //this.logger.debug(`Creating gdpr with nationalId - ${gdpr.nationalId}`)
  //   this.applicationsRegistered.labels('res1').inc()
  //   return this.gdprModel.create(gdpr)
  // }
}
