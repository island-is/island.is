import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { VehicleModel } from './model/vehicle.model'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel)
    private vehicleModel: typeof VehicleModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    this.logger.info('Getting all vehicles...')
    return await this.vehicleModel.findAll({
      include: [
        {
          model: this.recyclingRequestModel,
        },
      ],
    })
  }

  async findByVehicleId(vehicleId: string): Promise<VehicleModel> {
    this.logger.info(`Finding vehicle for vehicleId - "${vehicleId}"`)
    return this.vehicleModel.findOne({
      where: { vehicleId },
    })
  }

  // async create(vehicle: VehicleModel): Promise<VehicleModel> {
  //   this.logger.debug(`Creating vehicle with vehicle id - ${vehicle.vehicleId}`)
  //   return this.vehicleModel.create(vehicle)
  // }
}
