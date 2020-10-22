import { Injectable } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { getEmailTemplate, GetEmailTemplateInput } from './emailTemplates'
import { logger } from '@island.is/logging'

@Injectable()
export class CommunicationsService {
  constructor(private readonly emailService: EmailService) {}
  async sendEmail(input: GetEmailTemplateInput) {
    try {
      const emailOptions = getEmailTemplate(input)
      await this.emailService.sendEmail(emailOptions)
    } catch (error) {
      logger.error('Failed to send email', { message: error.message })
      // we dont want the client to see these errors since they might contain sensitive data
      throw new Error('Failed to send message')
    }
  }
}
