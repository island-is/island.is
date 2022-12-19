import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TokenGuard } from '@island.is/judicial-system/auth'

import { Case, CaseExistsGuard, CurrentCase } from '../case'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { DeliverResponse } from '../defendant/models/deliver.response'
import { NotificationService } from './notification.service'

@UseGuards(TokenGuard, CaseExistsGuard)
@Controller('api/internal/case/:caseId')
@ApiTags('internal notifications')
export class InternalNotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('notification')
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a new notification for an existing case',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${caseId}`,
    )

    const {
      notificationSent,
    } = await this.notificationService.sendCaseNotification(
      notification,
      theCase,
    )

    return { delivered: notificationSent }
  }
}
