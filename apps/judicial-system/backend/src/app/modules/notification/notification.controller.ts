import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { UserRole, NotificationType } from '@island.is/judicial-system/types'
import {
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
  CaseService,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'
import { NotificationService } from './notification.service'

// Allows prosecutors to send heads-up and ready-for-court notifications
const prosecutorNotificationRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.HEADS_UP,
    NotificationType.READY_FOR_COURT,
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
  ],
} as RolesRule

@UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard)
@Controller('api/case/:caseId')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly caseService: CaseService,
    private readonly notificationService: NotificationService,
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
    @Param('caseId') _0: string,
    @CurrentCase() theCase: Case,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    return this.notificationService.sendCaseNotification(notification, theCase)
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
    @Param('caseId') _0: string,
    @CurrentCase() theCase: Case,
  ): Promise<Notification[]> {
    return this.notificationService.getAllCaseNotifications(theCase)
  }
}
