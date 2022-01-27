import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { GdprModel } from './gdpr.model'

@Injectable()
export class GdprService {
  constructor(
    @InjectModel(GdprModel)
    private gdprModel: typeof GdprModel,
  ) {}

  async findByNationalId(nationalId: string): Promise<GdprModel> {
    try {
      return await this.gdprModel.findOne({
        where: { nationalId },
      })
    } catch (error) {
      throw new Error(`Failed on findByNationalId request with error: ${error}`)
    }
  }

  async createGdpr(nationalId: string, gdprStatus: string) {
    try {
      const newGdpr: GdprModel = new GdprModel()
      newGdpr.nationalId = nationalId
      newGdpr.gdprStatus = gdprStatus
      await newGdpr.save()
    } catch (error) {
      throw new Error(`Failed on createGdpr request with error: ${error}`)
    }
  }

  async findAll(): Promise<GdprModel[]> {
    return await this.gdprModel.findAll()
  }
}
