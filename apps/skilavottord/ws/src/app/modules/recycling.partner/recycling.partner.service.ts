import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { VehicleOwnerModel } from '../vehicle.owner/model/vehicle.owner.model'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
  ) {}

  async findByPartnerId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.info(`Finding recycling partner by companyId - "${companyId}"`)
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
    })
  }

  //TODO in progress
  async findRecyclingPartnerVehicles(companyId: string): Promise<string> {
    const res = this.recyclingPartnerModel
      .findOne({
        where: { companyId },
        include: [
          {
            model: this.recyclingRequestModel,
          },
        ],
      })
      .then((rr) => {
        console.log(JSON.stringify(rr, null, 2))
        console.log('....inside then:' + rr.recyclingRequests[0].vehicleId)
        const vehicleId = rr.recyclingRequests[0].vehicleId
        VehicleModel.findOne({
          where: { vehicleId },
        }).then((v) => {
          console.log('vehicle data...')
          console.log(JSON.stringify(v, null, 2))
          //ownerNationalId
          const nationalId = v.ownerNationalId
          VehicleOwnerModel.findOne({ where: { nationalId } }).then((o) => {
            console.log('vehicleOwner data...')
            console.log(JSON.stringify(o, null, 2))
          })
        })
      })
    console.dir('---->' + JSON.stringify(res, null, 2))
    return 'RES'
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll()
    this.logger.info(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async findActive(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll({
      where: { active: true },
    })
    this.logger.info(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async createRecyclingPartner(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<boolean> {
    this.logger.info(
      'Creating recycling partner:' + JSON.stringify(recyclingPartner, null, 2),
    )
    await recyclingPartner.save()
    return true
  }
}
