import { SendMailOptions } from 'nodemailer'

import { Application } from '@island.is/application/core'

export type AssignApplicationThroughEmail = {
  type: 'assignThroughEmail'
  generateTemplate: (application: Application, token: string) => SendMailOptions
}
export type SendEmail = { type: 'sendEmail'; template: SendMailOptions }

export type ApplicationAPITemplateAction =
  | SendEmail
  | AssignApplicationThroughEmail
