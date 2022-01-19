import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { paginate } from '@island.is/nest/pagination'

import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
} from '../recyclingRequest'
import { RecyclingPartnerModel } from '../recyclingPartner'
import { VehicleModel } from './vehicle.model'

@Injectable()
export class VehicleService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(VehicleModel)
    private vehicleModel: VehicleModel,
  ) {}

  async findAllByFilter(
    first: number,
    after: string,
    filter?: { requestType?: RecyclingRequestTypes; partnerId?: string },
  ) {
    return paginate<VehicleModel>({
      Model: this.vehicleModel,
      limit: first,
      after,
      primaryKeyField: 'vehicleId',
      orderOption: [['updatedAt', 'DESC']],
      include: [
        {
          model: RecyclingRequestModel,
          where: {
            ...(filter.requestType ? { requestType: filter.requestType } : {}),
            ...(filter.partnerId
              ? {
                  recyclingPartnerId: filter.partnerId,
                }
              : {}),
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
