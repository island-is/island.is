import { Application } from '@island.is/application/core'
import { Config as DrivingLicenseApiConfig } from '@island.is/api/domains/driving-license'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { Message } from '@island.is/email-service'
import { PartyApplicationServiceOptions } from '../modules/templates/party-application/party-application.service'
import { User } from '@island.is/auth-nest-tools'
import { PaymentScheduleServiceOptions } from '@island.is/clients/payment-schedule'
import {
  PaymentScheduleCharge,
  PaymentSchedulePayment,
  PaymentScheduleType,
} from '@island.is/api/schema'

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
    defaultClosedDate: Date
  }
  partyApplication: {
    endorsementsApiBasePath: string
    options: PartyApplicationServiceOptions
    defaultClosedDate: Date
  }
  generalPetition: {
    endorsementsApiBasePath: string
  }
  paymentScheduleConfig: PaymentScheduleServiceOptions
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

export type PublicDebtPaymentPlanPayment = {
  id: PaymentScheduleType
  totalAmount: number
  distribution: PaymentSchedulePayment[]
  amountPerMonth: number
  numberOfMonths: number
  organization: string
  chargetypes: PaymentScheduleCharge[]
}

export type PublicDebtPaymentPlanPaymentCollection = {
  [key: string]: PublicDebtPaymentPlanPayment
}

export type PublicDebtPaymentPlanPrerequisites = {
  type: PaymentScheduleType
  organizationId: string
  chargetypes: {
    id: string
    name: string
    total: number
    intrest: number
    expenses: number
    principal: number
  }[]
}
