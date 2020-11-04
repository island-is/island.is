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
    try {
      const res = await this.recyclingRequestModel.findAll({
        where: { vehicleId: permno },
        order: [['updatedAt', 'DESC']],
      })
      return res
    } catch (err) {
      this.logger.error(
        `Getting error when trying to findAllWithPermno: ${permno}`,
      )
      throw new Error(err)
    }
  }

  async createRecyclingRequest(
    requestType: string,
    permno: string,
    partnerId: number,
  ): Promise<boolean> {
    // ToDo all the works
    console.log(permno)
    console.log(requestType)
    console.log(partnerId)
    return true
  }
}
