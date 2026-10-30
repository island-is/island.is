import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  ServiceInterruptionBanner,
  ServiceInterruptionBannerRepositoryService,
} from '../repository'
import { UpdateServiceInterruptionBannerDto } from './dto/updateServiceInterruptionBanner.dto'

const trimOrEmpty = (value?: string | null): string | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }

  return value.trim()
}

@Injectable()
export class ServiceInterruptionBannerService {
  constructor(
    private readonly serviceInterruptionBannerRepositoryService: ServiceInterruptionBannerRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  get(): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Getting service interruption banner settings')

    return this.serviceInterruptionBannerRepositoryService.find()
  }

  update(
    update: UpdateServiceInterruptionBannerDto,
    modifiedBy: string,
  ): Promise<ServiceInterruptionBanner> {
    this.logger.debug('Updating service interruption banner settings')

    return this.serviceInterruptionBannerRepositoryService.update({
      title: trimOrEmpty(update.title),
      globalMessage: trimOrEmpty(update.globalMessage),
      prosecutorMessage: trimOrEmpty(update.prosecutorMessage),
      courtMessage: trimOrEmpty(update.courtMessage),
      modifiedBy,
    })
  }
}
