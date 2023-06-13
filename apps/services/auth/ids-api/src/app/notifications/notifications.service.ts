import { Injectable } from '@nestjs/common'

import { SmsService } from '@island.is/nova-sms'

import { SmsMessage } from './dto/sms-message'

@Injectable()
export class NotificationsService {
  constructor(private readonly smsService: SmsService) {}

  async sendSms(message: SmsMessage) {
    await this.smsService.sendSms(message.toPhoneNumber, message.content)
  }
}
