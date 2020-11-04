import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { VehicleOwnerModel } from './model/vehicle.owner.model'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'

@Injectable()
export class VehicleOwnerService {
  constructor(
    @InjectModel(VehicleOwnerModel)
    private vehicleOwnerModel: typeof VehicleOwnerModel,
    @InjectModel(VehicleModel)
    private vehicleModel: typeof VehicleModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findAll(): Promise<VehicleOwnerModel[]> {
    const res = this.vehicleOwnerModel.findAll({
      include: [
        {
          model: this.vehicleModel,
        },
      ],
    })
    return res
  }

  async findTEST(): Promise<VehicleOwnerModel[]> {
    const res = VehicleOwnerModel.findAll({
      include: [
        {
          model: VehicleModel,
          include: [
            {
              model: RecyclingRequestModel,
            },
          ],
        },
      ],
    })
    return res
  }

  async findByNationalId(nationalId: string): Promise<VehicleOwnerModel> {
    this.logger.info(`Finding vehicle owner by vehicleId - "${nationalId}"`)
    return this.vehicleOwnerModel.findOne({
      where: { nationalId },
      include: [
        {
          model: this.vehicleModel,
        },
      ],
    })
  }

  // async create(vehicleOwner: VehicleOwnerModel): Promise<VehicleOwnerModel> {
  //   this.logger.debug(
  //     `Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId}`,
  //   )
  //   this.applicationsRegistered.labels('res1').inc()
  //   return this.vehicleOwnerModel.create(vehicleOwner)
  // }
}
