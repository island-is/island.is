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
    this.logger.info('finding all deregistered...')
    const recreq = new RecyclingRequestModel()
    logger.debug('create test recyclingRequest')
    recreq.nameOfRequestor = 'sssssssss'
    recreq.vehicleId = 'FZG90'
    recreq.requestType = 'handOver'
    recreq.save()

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
    return this.vehicleModel.findOne({
      where: { vehicleId },
    })
  }

  // async create(vehicle: VehicleModel): Promise<VehicleModel> {
  //   this.logger.debug(`Creating vehicle with vehicle id - ${vehicle.vehicleId}`)
  //   return this.vehicleModel.create(vehicle)
  // }
}
