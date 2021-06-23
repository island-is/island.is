import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
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
    try {
      return await VehicleModel.findAll({
        include: [
          {
            model: RecyclingRequestModel,
          },
        ],
      })
    } catch (error) {
      this.logger.error('error finding all vehicles:' + error)
    }
  }

  async findAllDeregistered(): Promise<VehicleModel[]> {
    this.logger.info('finding all deregistered vehicles...')
    try {
      return await VehicleModel.findAll({
        include: [
          {
            model: RecyclingRequestModel,
            where: {
              requestType: 'deregistered',
            },
            include: [
              {
                model: RecyclingPartnerModel,
              },
            ],
          },
        ],
      })
    } catch (error) {
      this.logger.error('error finding all deregistered vehicles:' + error)
    }
  }

  async findByVehicleId(vehicleId: string): Promise<VehicleModel> {
    this.logger.info(`Finding vehicle for vehicleId - "${vehicleId}" ...`)
    try {
      return await VehicleModel.findOne({
        where: { vehicleId },
      })
    } catch (error) {
      this.logger.error('error finding vehicle by vehicle-id:' + error)
    }
  }

  async create(vehicle: VehicleModel): Promise<boolean> {
    try {
      this.logger.info(
        `starting creating vehicle with vehicle id - ${vehicle.vehicleId}...`,
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
      await vehicle.save()
      this.logger.info(
        `finished creating vehicle with vehicle id - ${vehicle.vehicleId}`,
      )
      return true
    } catch (err) {
      this.logger.error(
        `error trying to create vehicle with number: ${vehicle.vehicleId} with error: ${err}`,
      )
      throw new Error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId}`,
      )
    }
  }
}
