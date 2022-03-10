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
import { UserRole, NotificationType } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
  RulesType,
} from '@island.is/judicial-system/auth'

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.resopnse'
import { NotificationService } from './notification.service'

// Allows prosecutors to send heads-up and ready-for-court notifications
const prosecutorNotificationRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.HEADS_UP,
    NotificationType.READY_FOR_COURT,
    NotificationType.MODIFIED,
    NotificationType.REVOKED,
  ],
} as RolesRule

// Allows judges to send court-date and ruling notifiications
const judgeNotificationRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.RECEIVED_BY_COURT,
    NotificationType.COURT_DATE,
    NotificationType.RULING,
    NotificationType.MODIFIED,
  ],
} as RolesRule

// Allows registrars to send court-date
const registrarNotificationRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.RECEIVED_BY_COURT,
    NotificationType.COURT_DATE,
    NotificationType.MODIFIED,
  ],
} as RolesRule

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
  )
  @Post('notification')
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Sends a new notification for an existing case',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${caseId}`,
    )

    return this.notificationService.sendCaseNotification(
      notification,
      theCase,
      user,
    )
  }

  @UseGuards(CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
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
