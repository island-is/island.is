import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { RecyclingRequestModel } from './model/recycling.request.model'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @InjectModel(VehicleModel) private vehicleModel: typeof VehicleModel,
  ) {}

  async findAll(): Promise<RecyclingRequestModel[]> {
    //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
    const res = this.recyclingRequestModel.findAll({
      include: [
        {
          model: this.vehicleModel,
        },
      ],
    })
    return res
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
