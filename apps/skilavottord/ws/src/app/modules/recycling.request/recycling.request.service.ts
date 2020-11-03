import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class RecyclingRequestService {
  constructor(
    @InjectModel(RecyclingRequestModel)
    private recyclingRequestModel: typeof RecyclingRequestModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findAll(): Promise<RecyclingRequestModel[]> {
    this.logger.info('---- Starting findAll Recycling request ----')
    const res = await this.recyclingRequestModel.findAll()
    return res
  }

  async findAllWithPermno(permno: string): Promise<RecyclingRequestModel[]> {
    this.logger.info('---- Starting findAllWithPermno Recycling request ----')
    const res = await this.recyclingRequestModel.findAll({
      where: { vehicleId: permno },
      order: [['updatedAt', 'DESC']],
    })
    return res
  }
}
