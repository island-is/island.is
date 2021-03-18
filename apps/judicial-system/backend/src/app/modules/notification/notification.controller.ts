import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
  RulesType,
} from '@island.is/judicial-system/auth'

import { CaseService, isCaseBlockedFromUser } from '../case'
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
  dtoFieldValues: [NotificationType.COURT_DATE, NotificationType.RULING],
} as RolesRule

// Allows registrars to send court-date
const registrarNotificationRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [NotificationType.COURT_DATE],
} as RolesRule

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:id')
@ApiTags('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async findCaseById(id: string, user: User) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    if (isCaseBlockedFromUser(existingCase, user)) {
      throw new ForbiddenException(
        `User ${user.id} does not have access to case ${id}`,
      )
    }

    return existingCase
  }

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
  async sendNotificationByCaseId(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() notification: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const existingCase = await this.findCaseById(id, user)

    return this.notificationService.sendCaseNotification(
      notification,
      existingCase,
    )
  }

  @Get('notifications')
  @ApiOkResponse({
    type: Notification,
    isArray: true,
    description: 'Gets all existing notifications for an existing case',
  })
  async getAllNotificationsById(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<Notification[]> {
    const existingCase = await this.findCaseById(id, user)

    return this.notificationService.getAllCaseNotifications(existingCase)
  }
}
