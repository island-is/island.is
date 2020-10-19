import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { VehicleModel, VehicleOwnerModel } from '../models'
import { Logger } from '@island.is/logging'

@Injectable()
export class VehicleOwnerService {
  constructor(
    @InjectModel(VehicleOwnerModel)
    private vehicleOwnerModel: typeof VehicleOwnerModel,
    @InjectModel(VehicleModel)
    private vehicleModel: typeof VehicleModel,
  ) {}

  // async findAll(): Promise<VehicleOwnerModel[]> {
  //   //this.logger.debug(`Finding vehicle owner for nationalId - "${nationalId}"`)
  //   return await this.vehicleOwnerModel.findAll()
  // }

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

  // async findByNationalId(nationalId: string): Promise<VehicleOwnerModel> {
  //   this.logger.debug(`Finding vehicle owner for vehicleId - "${nationalId}"`)
  //   return this.vehicleOwnerModel.findOne({
  //     where: { nationalId },
  //   })
  // }

  // async create(vehicleOwner: VehicleOwnerModel): Promise<VehicleOwnerModel> {
  //   this.logger.debug(
  //     `Creating vehicleOwner with vehicleId - ${vehicleOwner.nationalId}`,
  //   )
  //   this.applicationsRegistered.labels('res1').inc()
  //   return this.vehicleOwnerModel.create(vehicleOwner)
  // }
}
