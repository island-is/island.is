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
    this.logger.info('finding all owners...')
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
      this.logger.error('error finding all owners:' + error)
    }
  }

  async findByNationalId(nationalId: string): Promise<VehicleOwnerModel> {
    this.logger.info(`finding vehicleOwner by vehicleId - "${nationalId}"...`)
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
      this.logger.error('error finding vehicleOwner by vehicleid:' + error)
    }
  }

  async create(vehicleOwner: VehicleOwnerModel): Promise<boolean> {
    this.logger.info(
      `starting Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId}...`,
    )
    try {
      // Check if he/she is already in the system
      const getVehicleOwner = await this.findByNationalId(
        vehicleOwner.nationalId,
      )
      if (getVehicleOwner) {
        this.logger.info(
          `${vehicleOwner.personname} with nationalId ${vehicleOwner.nationalId} is already in database`,
        )
        return true
      }

      // save to database
      await vehicleOwner.save()
      this.logger.info(
        `finished Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId}`,
      )
      return true
    } catch (error) {
      this.logger.error('error creating vehicleonwer:' + error)
    }
  }
}
