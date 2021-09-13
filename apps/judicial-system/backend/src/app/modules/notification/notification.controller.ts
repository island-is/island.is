import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

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

import { CaseService } from '../case'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'
import { NotificationService } from './notification.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
const registrarRule = UserRole.REGISTRAR as RolesRule

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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly caseService: CaseService,
    private readonly notificationService: NotificationService,
  ) {}

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
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    return this.notificationService.sendCaseNotification(
      notification,
      existingCase,
    )
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('notifications')
  @ApiOkResponse({
    type: Notification,
    isArray: true,
    description: 'Gets all existing notifications for an existing case',
  })
  async getAllCaseNotifications(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
  ): Promise<Notification[]> {
    const existingCase = await this.caseService.findByIdAndUser(
      caseId,
      user,
      false,
    )

    return this.notificationService.getAllCaseNotifications(existingCase)
  }
}
