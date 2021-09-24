import { Application } from '@island.is/application/core'
import { Config as DrivingLicenseApiConfig } from '@island.is/api/domains/driving-license'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { Message } from '@island.is/email-service'
import { PartyApplicationServiceOptions } from '../modules/templates/party-application/party-application.service'
import { User } from '@island.is/auth-nest-tools'

export interface BaseTemplateAPIModuleConfig {
  xRoadBasePathWithEnv: string
  jwtSecret: string
  clientLocationOrigin: string
  emailOptions: {
    useTestAccount: boolean
    useNodemailerApp?: boolean
    options?: {
      region: string
    }
  }
  baseApiUrl: string
  syslumenn: {
    url: string
    username: string
    password: string
  }
  email: {
    sender: string
    address: string
  }
  smsOptions: {
    url: string
    username: string
    password: string
  }
  drivingLicense: DrivingLicenseApiConfig
  attachmentBucket: string
  presignBucket: string
  paymentOptions: PaymentServiceOptions
  partyLetter: {
    partyLetterRegistryApiBasePath: string
    endorsementsApiBasePath: string
  }
  partyApplication: {
    endorsementsApiBasePath: string
    options: PartyApplicationServiceOptions
  }
}

export interface TemplateApiModuleActionProps {
  application: Application
  auth: User
}

export interface EmailTemplateGeneratorProps {
  application: Application
  options: {
    clientLocationOrigin: string
    locale: string
    email: { sender: string; address: string }
  }
}

export type AssignmentEmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
  assignLink: string,
) => Message

export type EmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
) => Message

export type AttachmentEmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
  fileContent: string,
  email: string,
) => Message
