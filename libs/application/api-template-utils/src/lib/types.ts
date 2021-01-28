import { SendMailOptions } from 'nodemailer'

import { Application } from '@island.is/application/core'

export interface EmailTemplateGeneratorProps {
  application: Application
  clientLocationOrigin: string
}

export type AssignApplicationThroughEmail = {
  type: 'assignThroughEmail'
  generateTemplate: (
    props: EmailTemplateGeneratorProps,
    token: string,
  ) => SendMailOptions
}
export type SendEmail = { type: 'sendEmail'; template: SendMailOptions }

export type ApplicationAPITemplateAction =
  | SendEmail
  | AssignApplicationThroughEmail

export type ParentResidenceChange = {
  name: string
  ssn: string
  phoneNumber: string
  email: string
  homeAddress: string
  postalCode: string
  city: string
}

export type ChildrenResidenceChange = {
  name: string
  ssn: string
}
