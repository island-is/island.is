import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { VehicleModel } from './model/vehicle.model'

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel)
    private vehicleModel: typeof VehicleModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    this.logger.debug(`Getting all vehicles...`)
    return await this.vehicleModel.findAll()
  }

  // async findByVehicleId(vehicleId: string): Promise<VehicleModel> {
  //   this.logger.debug(`Finding vehicle for vehicleId - "${vehicleId}"`)
  //   return this.vehicleModel.findOne({
  //     where: { vehicleId },
  //   })
  // }

  // async create(vehicle: VehicleModel): Promise<VehicleModel> {
  //   this.logger.debug(`Creating vehicle with vehicle id - ${vehicle.vehicleId}`)
  //   return this.vehicleModel.create(vehicle)
  // }
}
