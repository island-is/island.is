import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { VehicleModel } from '../models'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel)
    private vehicleModel: typeof VehicleModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
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
