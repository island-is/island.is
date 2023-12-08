import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
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
    try {
      return await VehicleModel.findOne({
        where: { vehicleId },
      })
    } catch (error) {
      throw new Error('Failed on findByVehicleId request with error:' + error)
    }
  }

  async create(vehicle: VehicleModel): Promise<boolean> {
    try {
      // Check if Vehicle is already in database
      const findVehicle = await this.findByVehicleId(vehicle.vehicleId)
      if (findVehicle) {
        // Remove old request if new owner
        if (vehicle.ownerNationalId === findVehicle.ownerNationalId) {
          return true
        } else {
          await findVehicle.destroy()
        }
      }
      // Save vehicle to database
      await vehicle.save()
      return true
    } catch (err) {
      throw new Error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId}`,
      )
    }
  }
}
