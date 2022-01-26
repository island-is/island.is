import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { VehicleModel } from '../vehicle'
import { VehicleOwnerModel } from './vehicleOwner.model'

@Injectable()
export class VehicleOwnerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(VehicleOwnerModel)
    private vehicleOwnerModel: VehicleOwnerModel,
  ) {}

  async findAll(): Promise<VehicleOwnerModel[]> {
    try {
      const res = await VehicleOwnerModel.findAll({
        include: [
          {
            model: VehicleModel,
          },
        ],
      })
      return res
    } catch (error) {
      throw new Error(
        `Failed on findAll vechileOwner request with error: ${error}`,
      )
    }
  }

  async findByNationalId(nationalId: string): Promise<VehicleOwnerModel> {
    try {
      return await VehicleOwnerModel.findOne({
        where: { nationalId },
        include: [
          {
            model: VehicleModel,
          },
        ],
      })
    } catch (error) {
      throw new Error(
        `Failed on findByNationalId vechileOwner request with error: ${error}`,
      )
    }
  }

  async create(vehicleOwner: VehicleOwnerModel): Promise<boolean> {
    try {
      // Check if he/she is already in the system
      const getVehicleOwner = await this.findByNationalId(
        vehicleOwner.nationalId,
      )
      if (getVehicleOwner) {
        return true
      }

      // save to database
      await vehicleOwner.save()
      return true
    } catch (error) {
      throw new Error(
        `Failed on create vechileOwner request with error: ${error}`,
      )
    }
  }
}
