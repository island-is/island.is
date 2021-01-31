import { SendMailOptions } from 'nodemailer'
import { Application } from '@island.is/application/core'

export interface BaseTemplateAPIModuleConfig {
  xRoadBasePathWithEnv: string
  jwtSecret: string
  clientLocationOrigin: string
  emailOptions: {
    useTestAccount: boolean
    options?: {
      region: string
    }
  }
}

export interface TemplateApiModuleActionProps {
  application: Application
  authorization: string
}

interface EmailTemplateGeneratorProps {
  application: Application
  options: {
    clientLocationOrigin: string
    locale: string // TODO union / enum
  }
}

export type AssignmentEmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
  assignLink: string,
) => SendMailOptions

export type EmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
) => SendMailOptions
