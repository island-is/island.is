import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GdprModel } from '../models'

@Injectable()
export class GdprService {
  // applicationsRegistered = new Counter({
  //   name: 'apps_gdpr',
  //   labelNames: ['gdpr'],
  //   help: 'Number of applications',
  // })

  constructor(
    @InjectModel(GdprModel)
    private gdprModel: typeof GdprModel,
  ) {}

  // async findByNationalId(nationalId: string): Promise<Gdpr> {
  //   //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
  //   return this.gdprModel.findOne({
  //     where: { nationalId },
  //   })
  // }

  async findAll(): Promise<GdprModel[]> {
    //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
    return await this.gdprModel.findAll()
  }

  // async create(gdpr: Gdpr): Promise<Gdpr> {
  //   //this.logger.debug(`Creating gdpr with nationalId - ${gdpr.nationalId}`)
  //   this.applicationsRegistered.labels('res1').inc()
  //   return this.gdprModel.create(gdpr)
  // }
}
