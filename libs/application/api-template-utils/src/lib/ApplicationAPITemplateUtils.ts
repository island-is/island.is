import jwt from 'jsonwebtoken'
import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'

import { EmailService } from '@island.is/email-service'
import {
  Application,
  ApplicationAPITemplateAction,
} from '@island.is/application/core'

const createAssignToken = (application: Application, secret: string) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
      state: application.state,
    },
    secret,
    { expiresIn: 24 * 60 * 60 },
  )

  return token
}

const createAssignTemplate = (
  application: Application,
  email: string,
  token: string,
): SendMailOptions => {
  const template = {
    from: {
      name: 'ParentalLeave application',
      address: 'baering@aranja.com',
    },
    replyTo: {
      name: 'ParentalLeave application',
      address: 'baering@aranja.com',
    },
    to: [
      {
        name: 'Employer',
        address: email,
      },
    ],
    subject: ``,
    text: dedent(`
      Hello employer, ${application.applicant} has assigned you as a reviewer of this application.
      
      If you were expecting this email, then assign yourself to the application here: http://localhost:4200/applications/assign?token=${token}
    `),
  }

  return template
}

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
    console.log('ApplicationAPITemplateUtils.sendEmail', template)
    console.log('skipping sending email')
    // return this.emailService.sendEmail(template)
  }

  async assignApplicationThroughEmail(email: string) {
    console.log(
      'ApplicationAPITemplateUtils.assignApplicationThroughEmail',
      email,
    )
    const token = createAssignToken(this.application, this.jwtSecret)
    const template = createAssignTemplate(this.application, email, token)

    return this.sendEmail(template)
  }

  async performAction(action: ApplicationAPITemplateAction) {
    console.log('ApplicationAPITemplateUtils.performAction', action)
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
      console.log('ApplicationAPITemplateUtils.performAction failed:')
      console.log(e)
      throw e
    }
  }
}

export default ApplicationAPITemplateUtils
