import { SendMailOptions } from 'nodemailer'

import { EmailService } from '@island.is/email-service'
import {
  Application,
  ApplicationAPITemplateAction,
} from '@island.is/application/core'

import { createAssignToken, createAssignTemplate } from './utils'

interface ApplicationAPITemplateUtilsConfig {
  jwtSecret: string
  emailService: EmailService
}

class ApplicationAPITemplateUtils {
  private readonly application: Application
  private readonly emailService: EmailService
  private readonly jwtSecret: string

  constructor(
    application: Application,
    config: ApplicationAPITemplateUtilsConfig,
  ) {
    this.application = application
    this.emailService = config.emailService
    this.jwtSecret = config.jwtSecret
  }

  async sendEmail(template: SendMailOptions) {
    return this.emailService.sendEmail(template)
  }

  async assignApplicationThroughEmail(email: string) {
    const token = createAssignToken(this.application, this.jwtSecret)
    const template = createAssignTemplate(this.application, email, token)

    return this.sendEmail(template)
  }

  async performAction(action: ApplicationAPITemplateAction) {
    try {
      switch (action.type) {
        case 'assignThroughEmail':
          const email = this.application.answers[action.emailAnswerKey]
          return this.assignApplicationThroughEmail(email as string)
        case 'email':
          return this.sendEmail(action.template)
        default:
          throw new Error('Invalid action')
      }
    } catch (e) {
      throw e
    }
  }
}

export default ApplicationAPITemplateUtils
