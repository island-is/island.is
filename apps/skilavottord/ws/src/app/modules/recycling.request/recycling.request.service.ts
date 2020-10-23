import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @InjectModel(VehicleModel) private vehicleModel: typeof VehicleModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findAll(): Promise<RecyclingRequestModel[]> {
    const res = await this.recyclingRequestModel.findAll({
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
