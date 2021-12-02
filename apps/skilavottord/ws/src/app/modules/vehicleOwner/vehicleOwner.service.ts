import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { VehicleModel } from '../vehicle'
import { RecyclingRequestModel } from '../recyclingRequest'
import { VehicleOwnerModel } from './vehicleOwner.model'

@Injectable()
export class VehicleOwnerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
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

  async findRecyclingPartnerVehicles(
    partnerId: string,
  ): Promise<VehicleOwnerModel[]> {
    this.logger.info('finding recyclingPartner vehicles...')
    try {
      const res = await VehicleOwnerModel.findAll({
        include: [
          {
            model: VehicleModel,
            right: true,
            include: [
              {
                model: RecyclingRequestModel,
                where: {
                  //requestType: 'test',
                  recyclingPartnerId: partnerId,
                },
              },
            ],
          },
        ],
      })
      return res
    } catch (error) {
      this.logger.error('error finding recyclingPartner vehicles:' + error)
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
