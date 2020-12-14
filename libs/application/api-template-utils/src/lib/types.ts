import { SendMailOptions } from 'nodemailer'

type AssignApplicationThroughEmail = {
  type: 'assignThroughEmail'
  emailAnswerKey: string
}
type SendEmail = { type: 'email'; template: SendMailOptions }

export type ApplicationAPITemplateAction =
  | SendEmail
  | AssignApplicationThroughEmail
