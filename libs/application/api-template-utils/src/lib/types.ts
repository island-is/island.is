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

export interface PersonResidenceChange {
  name: string
  ssn: string
}

export interface ParentResidenceChange extends PersonResidenceChange {
  phoneNumber: string
  email: string
  homeAddress: string
  postalCode: string
  city: string
}

export enum PDF_TYPES {
  CHILDREN_RESIDENCE_CHANGE = 'CHILDREN_RESIDENCE_CHANGE'
}
