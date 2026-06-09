import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

import {
  MessageSuspension,
  MessageSuspensionRepositoryService,
} from '../repository'
import { UpdateMessageSuspensionDto } from './dto/updateMessageSuspension.dto'

@Injectable()
export class MessageSuspensionService {
  constructor(
    private readonly messageSuspensionRepositoryService: MessageSuspensionRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  getAll(): Promise<MessageSuspension[]> {
    this.logger.debug('Getting all message suspensions')

    return this.messageSuspensionRepositoryService.findAll()
  }

  update(
    category: MessageSuspensionCategory,
    update: UpdateMessageSuspensionDto,
    modifiedBy: string,
  ): Promise<MessageSuspension> {
    this.logger.debug(`Updating message suspension ${category}`)

    return this.messageSuspensionRepositoryService.update(category, {
      ...update,
      modifiedBy,
    })
  }
}
