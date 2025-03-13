import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { paginate } from '@island.is/nest/pagination'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingPartnerModel } from '../recyclingPartner'
import { MunicipalityModel } from '../municipality/municipality.model'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
} from '../recyclingRequest'
import { VehicleModel } from './vehicle.model'

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
    let partnerIds = []

    // Get all sub recycling partners of the municipality
    // else get all
    if (filter.partnerId) {
      try {
        const recyclingPartners = await RecyclingPartnerModel.findAll({
          where: {
            municipalityId: filter.partnerId,
          },
          attributes: ['companyId', 'companyName', 'municipalityId'],
        })

        partnerIds = [
          filter.partnerId,
          ...recyclingPartners.map((partner) => partner.companyId),
        ]
      } catch (error) {
        this.logger.error('Failed to fetch sub-partners:', error)
        throw new Error('Failed to process municipality partners')
      }
    } else {
      partnerIds = null
    }

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
            ...(partnerIds
              ? {
                  recyclingPartnerId: partnerIds,
                }
              : {}),
          },
          include: [
            {
              model: RecyclingPartnerModel,
              attributes: ['companyId', 'companyName', 'municipalityId'],
              required: false, // Allows for left join
              include: [
                {
                  model: MunicipalityModel,
                  attributes: ['companyName'],
                  as: 'municipality',
                  required: false,
                },
              ],
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

  async updateVehicleInfo(
    permno: string,
    mileage: number,
    plateCount: number,
    plateLost: boolean,
  ): Promise<boolean> {
    const findVehicle = await this.findByVehicleId(permno)
    if (findVehicle) {
      findVehicle.mileage = mileage ?? 0
      findVehicle.plateCount = plateCount
      findVehicle.plateLost = plateLost

      await findVehicle.save()
      return true
    } else {
      const errorMsg = `Failed to update vehicleInfo for vehicle: ${permno}`
      this.logger.error(
        `car-recycling: Failed to update vehicleInfo for vehicle: ${permno.slice(
          -3,
        )}`,
        { mileage, plateCount, plateLost },
      )
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
          this.logger.info(
            `car-recycling: Changing owner of the vehicle: ${vehicle.vehicleId.slice(
              -3,
            )}`,
          )
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
