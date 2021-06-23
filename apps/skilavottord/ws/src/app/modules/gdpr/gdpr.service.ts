import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GdprModel } from './model/gdpr.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class GdprService {
  constructor(
    @InjectModel(GdprModel)
    private gdprModel: typeof GdprModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findByNationalId(nationalId: string): Promise<GdprModel> {
    this.logger.info(`Finding gdpr for nationalId - "${nationalId}"`)
    try {
      return await this.gdprModel.findOne({
        where: { nationalId },
      })
    } catch (error) {
      this.logger.error('error finding gdprModel:' + error)
    }
  }

  async createGdpr(nationalId: string, gdprStatus: string) {
    this.logger.info(
      `Insert gdpr nationalId:${nationalId} gdprStatus: ${gdprStatus}`,
    )
    try {
      const newGdpr: GdprModel = new GdprModel()
      newGdpr.nationalId = nationalId
      newGdpr.gdprStatus = gdprStatus
      await newGdpr.save()
    } catch (error) {
      this.logger.error('error creating gdpr:' + error)
    }
  }

  async findAll(): Promise<GdprModel[]> {
    return await this.gdprModel.findAll()
  }
}
