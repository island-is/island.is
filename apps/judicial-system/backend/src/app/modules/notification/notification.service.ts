import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'

import { Notification } from '../case/models'

@Injectable()
export class NotificationService {
  constructor(
    @Inject(SmsService)
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
