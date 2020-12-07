import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/judicial-system/types'
import { CurrentHttpUser, JwtAuthGuard } from '@island.is/judicial-system/auth'

import { UserService } from '../user'
import { CaseService } from '../case'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'
import { NotificationService } from './notification.service'

@UseGuards(JwtAuthGuard)
@Controller('api/case/:id')
@ApiTags('cases')
export class NotificationController {
  constructor(
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(CaseService)
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return existingCase
  }

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
    const existingCase = await this.findCaseById(id)

    return this.notificationService.sendCaseNotification(
      notification,
      existingCase,
      user,
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
  ): Promise<Notification[]> {
    const existingCase = await this.findCaseById(id)

    return this.notificationService.getAllCaseNotifications(existingCase)
  }
}
