import { EmailService } from '@island.is/email-service'
import { Application } from '@island.is/application/core'

import { createAssignToken } from './utils'
import {
  ApplicationAPITemplateAction,
  AssignApplicationThroughEmail,
  SendEmail,
} from './types'

type GenericEmailService = Pick<EmailService, 'sendEmail'>

interface ApplicationAPITemplateUtilsConfig {
  jwtSecret: string
  emailService: GenericEmailService
  clientLocationOrigin: string
}

interface EmailTemplateGeneratorProps {
  application: Application
  clientLocationOrigin: string
}

class ApplicationAPITemplateUtils {
  private readonly application: Application
  private readonly emailService: GenericEmailService
  private readonly jwtSecret: string
  private readonly clientLocationOrigin: string

  constructor(
    application: Application,
    config: ApplicationAPITemplateUtilsConfig,
  ) {
    this.application = application
    this.emailService = config.emailService
    this.jwtSecret = config.jwtSecret
    this.clientLocationOrigin = config.clientLocationOrigin
  }

  createEmailTemplateGeneratorProps(): EmailTemplateGeneratorProps {
    return {
      application: this.application,
      clientLocationOrigin: this.clientLocationOrigin,
    }
  }

  async sendEmail({ template }: SendEmail) {
    return this.emailService.sendEmail(template)
  }

  async assignApplicationThroughEmail({
    generateTemplate,
  }: AssignApplicationThroughEmail) {
    const token = createAssignToken(this.application, this.jwtSecret)
    const template = generateTemplate(
      this.createEmailTemplateGeneratorProps(),
      token,
    )

    return this.performAction({ type: 'sendEmail', template })
  }

  async performAction(action: ApplicationAPITemplateAction): Promise<string> {
    try {
      switch (action.type) {
        case 'assignThroughEmail':
          return this.assignApplicationThroughEmail(action)
        case 'sendEmail':
          return this.sendEmail(action)
        default:
          throw new Error('Invalid action')
      }
    } catch (e) {
      throw e
    }
  }
}

export default ApplicationAPITemplateUtils
