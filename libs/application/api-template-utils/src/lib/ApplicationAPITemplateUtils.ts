import fetch from 'isomorphic-fetch'
import { EmailService } from '@island.is/email-service'
import { Application } from '@island.is/application/core'

import { createAssignToken } from './utils'
import {
  ApplicationAPITemplateAction,
  AssignApplicationThroughEmail,
  SendEmail,
  CallAPI,
} from './types'

type GenericEmailService = Pick<EmailService, 'sendEmail'>

interface ApplicationAPITemplateUtilsConfig {
  jwtSecret: string
  emailService: GenericEmailService
  clientLocationOrigin: string
  authorization: string
}

interface EmailTemplateGeneratorProps {
  application: Application
  clientLocationOrigin: string
}

class ApplicationAPITemplateUtils {
  private readonly application: Application
  private readonly emailService: GenericEmailService
  private readonly jwtSecret: string
  private readonly authorization: string
  private readonly clientLocationOrigin: string

  constructor(
    application: Application,
    config: ApplicationAPITemplateUtilsConfig,
  ) {
    this.application = application
    this.emailService = config.emailService
    this.jwtSecret = config.jwtSecret
    this.authorization = config.authorization
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

  async callAPI({ url, generateRequestOptions }: CallAPI) {
    const requestOptions = generateRequestOptions(
      this.application,
      this.authorization,
    )

    return fetch(url, requestOptions)
  }

  async performAction(
    action: ApplicationAPITemplateAction,
  ): Promise<string | Response> {
    switch (action.type) {
      case 'assignThroughEmail':
        return this.assignApplicationThroughEmail(action)
      case 'sendEmail':
        return this.sendEmail(action)
      case 'callAPI':
        return this.callAPI(action)
      default:
        throw new Error('Invalid action')
    }
  }
}

export default ApplicationAPITemplateUtils
