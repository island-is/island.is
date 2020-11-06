import { Inject, Injectable } from '@nestjs/common'
import { logger, Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { VehicleModel } from './model/vehicle.model'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { RecyclingPartnerModel } from '../recycling.partner/model/recycling.partner.model'

@Injectable()
export class VehicleService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    this.logger.info('Getting all vehicles...')
    return await VehicleModel.findAll({
      include: [
        {
          model: RecyclingRequestModel,
        },
      ],
    })
  }

  async findAllDeregistered(): Promise<VehicleModel[]> {
    return await VehicleModel.findAll({
      include: [
        {
          model: RecyclingRequestModel,
          where: {
            //requestType: 'test',
            requestType: 'handOver',
            // recyclingPartnerId: NotNull,
          },
          include: [
            {
              model: RecyclingPartnerModel,
            },
          ],
        },
      ],
    })
  }

  async findByVehicleId(vehicleId: string): Promise<VehicleModel> {
    this.logger.info(`Finding vehicle for vehicleId - "${vehicleId}"`)
    return VehicleModel.findOne({
      where: { vehicleId },
    })
  }

  async create(vehicle: VehicleModel): Promise<boolean> {
    try {
      this.logger.info(
        `---- Starting creating vehicle with vehicle id - ${vehicle.vehicleId} ----`,
      )
      // Check if Vehicle is already in database
      const findVehicle = await this.findByVehicleId(vehicle.vehicleId)
      if (findVehicle) {
        this.logger.info(
          `vehicle ${vehicle.vehicleId} is already in the database`,
        )
        return true
      }

      // Save vehicle to database
      vehicle.save()
      this.logger.info(
        `---- Finished creating vehicle with vehicle id - ${vehicle.vehicleId} ----`,
      )
      return true
    } catch (err) {
      this.logger.error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId} with error: ${err}`,
      )
      throw new Error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId}`,
      )
    }
  }
}
