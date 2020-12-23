import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Claim } from '../entities/models/claim.model'
import { Sequelize } from 'sequelize-typescript'
import { UserIdentity } from '../entities/models/user-identity.model'
import { UserIdentityDto } from '../entities/dto/user-identity.dto'

@Injectable()
export class ClaimsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Claim)
    private claimModel: typeof Claim,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all Claim Types */
  async findAll(): Promise<Claim[] | null> {
    // return this.claimModel.aggregate('type', 'DISTINCT', { plain: false })
    return this.claimModel.findAll({
      attributes: [Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type'],
    })
  }
}
