import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  assistantRule,
} from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import {
  judgeNotificationRule,
  prosecutorNotificationRule,
  registrarNotificationRule,
  assistantNotificationRule,
} from './guards/rolesRules'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.response'
import { NotificationService } from './notification.service'

@UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard)
@Controller('api/case/:caseId')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @RolesRules(
    prosecutorNotificationRule,
    judgeNotificationRule,
    registrarNotificationRule,
    assistantNotificationRule,
  )
  @Post('notification')
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Adds a new notification for an existing case to queue',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Adding ${notification.type} notification for case ${caseId} to queue`,
    )

    return this.notificationService.addMessagesForNotificationToQueue(
      notification,
      theCase,
      user,
    )
  }

  @UseGuards(CaseReadGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
  )
  @Get('notifications')
  @ApiOkResponse({
    type: Notification,
    isArray: true,
    description: 'Gets all existing notifications for an existing case',
  })
  async getAllCaseNotifications(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case ${caseId}`)

    return this.notificationService.getAllCaseNotifications(theCase)
  }
}
