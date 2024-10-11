import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'

import { Case, CaseHasExistedGuard, CurrentCase } from '../case'
import { CaseNotificationDto } from './dto/caseNotification.dto'
import { NotificationBodyDto } from './dto/institutionNotification.dto'
import { DeliverResponse } from './models/deliver.response'
import { InstitutionNotificationService } from './institutionNotification.service'
import { InternalNotificationService } from './internalNotification.service'
import { NotificationDispatchService } from './notificationDispatch.service'

@UseGuards(TokenGuard)
@Controller('api/internal')
@ApiTags('internal notifications')
export class InternalNotificationController {
  constructor(
    private readonly internalNotificationService: InternalNotificationService,
    private readonly notificationDispatchService: NotificationDispatchService,
    private readonly institutionNotificationService: InstitutionNotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post(`case/:caseId/${messageEndpoint[MessageType.NOTIFICATION]}`)
  @UseGuards(CaseHasExistedGuard)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a new notification for an existing case',
  })
  sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: CaseNotificationDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Sending ${notificationDto.type} notification for case ${caseId}`,
    )

    return this.internalNotificationService.sendCaseNotification(
      notificationDto.type,
      theCase,
      notificationDto.user,
    )
  }

  @Post(messageEndpoint[MessageType.NOTIFICATION])
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Sends a new notification',
  })
  sendNotification(
    @Body() notificationDto: NotificationBodyDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Sending ${notificationDto.type} notification`)

    return notificationDto.prosecutorsOfficeId
      ? this.institutionNotificationService.sendNotification(
          notificationDto.type,
          notificationDto.prosecutorsOfficeId,
        )
      : this.institutionNotificationService.sendNotification(
          notificationDto.type,
          notificationDto.prosecutorsOfficeId,
        )
  }

  @Post(messageEndpoint[MessageType.NOTIFICATION_DISPATCH])
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Dispatches notifications',
  })
  dispatchNotification(
    @Body() notificationDto: NotificationBodyDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Dispatching ${notificationDto.type} notification`)

    return this.notificationDispatchService.dispatchNotification(
      notificationDto.type,
    )
  }
}
