import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Claim } from '../entities/models/claim.model'
import { Sequelize } from 'sequelize-typescript'
import { trace } from '@theo.gravity/datadog-apm'

@trace()
@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim)
    private claimModel: typeof Claim,
    @Inject(Sequelize)
    private sequelize: Sequelize,
  ) {}

  /** Get's all Claim Types */
  async findAll(): Promise<Claim[] | null> {
    return this.claimModel.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type']],
    })
  }
}
