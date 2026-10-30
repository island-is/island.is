import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { ServiceInterruptionBanner } from '../models/serviceInterruptionBanner.model'

export const SERVICE_INTERRUPTION_BANNER_ID = 1

interface UpdateServiceInterruptionBanner {
  title?: string
  globalMessage?: string
  prosecutorMessage?: string
  courtMessage?: string
  modifiedBy?: string
}

@Injectable()
export class ServiceInterruptionBannerRepositoryService {
  constructor(
    @InjectModel(ServiceInterruptionBanner)
    private readonly serviceInterruptionBannerModel: typeof ServiceInterruptionBanner,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async find(): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Finding service interruption banner settings')

    const banner = await this.serviceInterruptionBannerModel.findByPk(
      SERVICE_INTERRUPTION_BANNER_ID,
    )

    if (!banner) {
      throw new NotFoundException('Service interruption banner not found')
    }

    return banner
  }

  async update(
    update: UpdateServiceInterruptionBanner,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Updating service interruption banner settings')

    const [numberOfAffectedRows, updatedBanners] =
      await this.serviceInterruptionBannerModel.update(update, {
        where: { id: SERVICE_INTERRUPTION_BANNER_ID },
        returning: true,
      })

    if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        'Could not update service interruption banner',
      )
    }

    return updatedBanners[0]
  }
}
