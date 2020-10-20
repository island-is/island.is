import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
  ) {}

  async findAll(): Promise<RecyclingRequestModel[]> {
    //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
    return await this.recyclingRequestModel.findAll()
  }

  // async findByNationalId(vehicleId: string): Promise<RecyclingRequestModel> {
  //   return this.recyclingRequestModel.findOne({
  //     where: { vehicleId },
  //   })
  // }

  // async create(
  //   recyclingRequest: RecyclingRequestModel,
  // ): Promise<RecyclingRequestModel> {
  //   return this.recyclingRequestModel.create(recyclingRequest)
  // }
}
