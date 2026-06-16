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

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { AppealCaseExistsGuard, CurrentAppealCase } from '../appeal-case'
import { CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { AppealCase, Case } from '../repository'
import { AppealNotificationDto } from './dto/appealNotification.dto'
import { NotificationDto } from './dto/notification.dto'
import {
  defenderAppealNotificationRule,
  defenderNotificationRule,
  districtCourtAssistantNotificationRule,
  districtCourtJudgeNotificationRule,
  districtCourtRegistrarNotificationRule,
  prosecutorAppealNotificationRule,
  prosecutorNotificationRule,
} from './guards/rolesRules'
import { SendNotificationResponse } from './models/sendNotification.response'
import { NotificationService } from './services/notification.service'

@Controller('api/case/:caseId')
@ApiTags('notifications')
@UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @RolesRules(
    prosecutorNotificationRule,
    districtCourtJudgeNotificationRule,
    districtCourtRegistrarNotificationRule,
    districtCourtAssistantNotificationRule,
    defenderNotificationRule,
  )
  @Post('notification')
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Adds a new notification for an existing case to queue',
  })
  sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: NotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Adding ${notificationDto.type} notification for case ${caseId} to queue`,
    )

    return this.notificationService.addMessagesForNotificationToQueue(
      notificationDto.type,
      notificationDto.eventOnly,
      theCase,
      user,
    )
  }

  @UseGuards(CaseWriteGuard, AppealCaseExistsGuard)
  @RolesRules(prosecutorAppealNotificationRule, defenderAppealNotificationRule)
  @Post('appeal/:appealCaseId/notification')
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Adds a new appeal case notification to queue',
  })
  sendAppealNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() appealNotificationDto: AppealNotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Adding ${appealNotificationDto.type} appeal notification for case ${caseId} to queue`,
    )

    return this.notificationService.addMessagesForAppealNotificationToQueue(
      appealNotificationDto.type,
      theCase,
      user,
      appealCase.id,
    )
  }
}
