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

import { CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { Case } from '../repository'
import { NotificationDto } from './dto/notification.dto'
import {
  courtOfAppealsAssistantNotificationRule,
  courtOfAppealsJudgeNotificationRule,
  courtOfAppealsRegistrarNotificationRule,
  defenderNotificationRule,
  districtCourtAssistantNotificationRule,
  districtCourtJudgeNotificationRule,
  districtCourtRegistrarNotificationRule,
  prosecutorNotificationRule,
} from './guards/rolesRules'
import { SendNotificationResponse } from './models/sendNotification.response'
import { NotificationService } from './notification.service'

@Controller('api/case/:caseId/notification')
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
    courtOfAppealsJudgeNotificationRule,
    courtOfAppealsRegistrarNotificationRule,
    courtOfAppealsAssistantNotificationRule,
    defenderNotificationRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: SendNotificationResponse,
    description: 'Adds a new notification for an existing case to queue',
  })
  async sendCaseNotification(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() notificationDto: NotificationDto,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Adding ${notificationDto.type} notification for case ${caseId} to queue`,
    )

    return this.notificationService.addNotificationMessagesToQueue(
      notificationDto.type,
      notificationDto.eventOnly,
      theCase,
      user,
    )
  }
}
