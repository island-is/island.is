import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { trimOrUndefined } from '@island.is/judicial-system/formatters'

import {
  ServiceInterruptionBanner,
  ServiceInterruptionBannerRepositoryService,
} from '../repository'
import { UpdateServiceInterruptionBannerDto } from './dto/updateServiceInterruptionBanner.dto'

@Injectable()
export class ServiceInterruptionBannerService {
  constructor(
    private readonly serviceInterruptionBannerRepositoryService: ServiceInterruptionBannerRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async get(): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Getting service interruption banner settings')

    const banner = await this.serviceInterruptionBannerRepositoryService.find()

    if (!banner) {
      throw new NotFoundException('Service interruption banner not found')
    }

    return banner
  }

  update(
    update: UpdateServiceInterruptionBannerDto,
    modifiedBy: string,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Updating service interruption banner settings')

    return this.serviceInterruptionBannerRepositoryService.update({
      title: trimOrUndefined(update.title),
      globalMessage: trimOrUndefined(update.globalMessage),
      prosecutorMessage: trimOrUndefined(update.prosecutorMessage),
      courtMessage: trimOrUndefined(update.courtMessage),
      modifiedBy,
    })
  }
}
