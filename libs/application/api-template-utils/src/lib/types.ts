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

interface RequestOptions {
  method: 'GET' | 'PUT' | 'POST'
  headers?: { [header: string]: string }
  body?: any
}

type GenerateRequestOptions = (
  application: Application,
  authorization: string,
) => RequestOptions

export type CallAPI = {
  type: 'callAPI'
  url: string
  generateRequestOptions: GenerateRequestOptions
}

export type ApplicationAPITemplateAction =
  | SendEmail
  | AssignApplicationThroughEmail
  | CallAPI
