import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { paginate } from '@island.is/nest/pagination'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
} from '../recyclingRequest'
import { RecyclingPartnerModel } from '../recyclingPartner'
import { VehicleModel } from './vehicle.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel)
    private vehicleModel: VehicleModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
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
    console.log('vehicle find by id...')
    try {
      return await VehicleModel.findOne({
        where: { vehicleId },
      })
    } catch (error) {
      throw new Error('Failed on findByVehicleId request with error:' + error)
    }
  }

  async updateMileage(permno: string, mileage: number): Promise<boolean> {
    const findVehicle = await this.findByVehicleId(permno)
    if (findVehicle) {
      findVehicle.mileage = mileage ?? 0
      await findVehicle.save()
      return true
    } else {
      const errorMsg = `failed to update mileage: ${mileage} on vehicle: ${permno}`
      this.logger.error(errorMsg)
      throw new Error(errorMsg)
    }
  }

  async create(vehicle: VehicleModel): Promise<boolean> {
    try {
      // check if vehicle is already in db
      const findVehicle = await this.findByVehicleId(vehicle.vehicleId)
      // if vehicle is found in db, check if there is new owner of vehicle
      if (findVehicle) {
        findVehicle.mileage = vehicle.mileage
        if (vehicle.ownerNationalId !== findVehicle.ownerNationalId) {
          findVehicle.ownerNationalId = vehicle.ownerNationalId
        }
        await findVehicle.save()
        return true
      } else {
        // new registration
        await vehicle.save()
        return true
      }
    } catch (err) {
      this.logger.error('error creating vehicle', err)
      throw new Error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId}`,
      )
    }
  }
}
