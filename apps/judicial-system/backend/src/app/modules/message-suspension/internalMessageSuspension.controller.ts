import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { MessageSuspension } from '../repository'
import { MessageSuspensionService } from './messageSuspension.service'

@Controller('api/internal/message-suspension')
@ApiTags('internal message suspensions')
@UseGuards(TokenGuard)
export class InternalMessageSuspensionController {
  constructor(
    private readonly messageSuspensionService: MessageSuspensionService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    type: MessageSuspension,
    isArray: true,
    description:
      'Gets the suspension state of all message categories for the message handler',
  })
  getAll(): Promise<MessageSuspension[]> {
    this.logger.debug('Getting all message suspensions for the message handler')

    return this.messageSuspensionService.getAll()
  }
}
