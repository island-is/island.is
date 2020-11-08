import { Inject, Injectable } from '@nestjs/common'
import { VehicleOwnerModel } from './model/vehicle.owner.model'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'

@Injectable()
export class VehicleOwnerService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  async findAll(): Promise<VehicleOwnerModel[]> {
    const res = VehicleOwnerModel.findAll({
      include: [
        {
          model: VehicleModel,
        },
      ],
    })
    return res
  }

  async findRecyclingPartnerVehicles(
    partnerId: string,
  ): Promise<VehicleOwnerModel[]> {
    const res = VehicleOwnerModel.findAll({
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
  }

  async findByNationalId(nationalId: string): Promise<VehicleOwnerModel> {
    this.logger.info(`Finding vehicle owner by vehicleId - "${nationalId}"`)
    return VehicleOwnerModel.findOne({
      where: { nationalId },
      include: [
        {
          model: VehicleModel,
        },
      ],
    })
  }

  async create(vehicleOwner: VehicleOwnerModel): Promise<boolean> {
    this.logger.info(
      `---- Starting Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId} ----`,
    )
    // Check if he/she is already in the system
    const getVehicleOwner = await this.findByNationalId(vehicleOwner.nationalId)
    if (getVehicleOwner) {
      this.logger.info(
        `${vehicleOwner.personname} with nationalId ${vehicleOwner.nationalId} is already in database`,
      )
      return true
    }

    // save to database
    vehicleOwner.save()
    this.logger.info(
      `---- Finished Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId} ----`,
    )
    return true
  }
}
