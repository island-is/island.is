import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Gdpr } from './gdpr.model'
//import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'

@Injectable()
export class GdprService {
  // applicationsRegistered = new Counter({
  //   name: 'apps_gdpr',
  //   labelNames: ['gdpr'],
  //   help: 'Number of applications',
  // })

  constructor(
    @InjectModel(Gdpr)
    private gdprModel: typeof Gdpr,
  ) {}

  // async findByNationalId(nationalId: string): Promise<Gdpr> {
  //   //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
  //   return this.gdprModel.findOne({
  //     where: { nationalId },
  //   })
  // }

  async findAll(): Promise<Gdpr[]> {
    //this.logger.debug(`Finding gdpr for nationalId - "${nationalId}"`)
    return await this.gdprModel.findAll()
  }

  // async create(gdpr: Gdpr): Promise<Gdpr> {
  //   //this.logger.debug(`Creating gdpr with nationalId - ${gdpr.nationalId}`)
  //   this.applicationsRegistered.labels('res1').inc()
  //   return this.gdprModel.create(gdpr)
  // }
}
