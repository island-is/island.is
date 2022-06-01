import {
  Application,
  ApplicationWithAttachments,
} from '@island.is/application/core'
import { Config as DrivingLicenseApiConfig } from '@island.is/api/domains/driving-license'
import { Config as CriminalRecordConfig } from '@island.is/api/domains/criminal-record'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { Message } from '@island.is/email-service'
import { User } from '@island.is/auth-nest-tools'
import { PaymentScheduleServiceOptions } from '@island.is/clients/payment-schedule'
import { HealthInsuranceV2Options } from '@island.is/clients/health-insurance-v2'
import { DataProtectionComplaintClientConfig } from '@island.is/clients/data-protection-complaint'
import { Injectable, Type } from '@nestjs/common'

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
  criminalRecord: CriminalRecordConfig
  attachmentBucket: string
  presignBucket: string
  paymentOptions: PaymentServiceOptions
  generalPetition: {
    endorsementsApiBasePath: string
  }
  paymentScheduleConfig: PaymentScheduleServiceOptions
  healthInsuranceV2: HealthInsuranceV2Options
  dataProtectionComplaint: DataProtectionComplaintClientConfig
  applicationService: Type<BaseTemplateApiApplicationService>
  userProfile: {
    serviceBasePath: string
  }
  nationalRegistry: {
    baseSoapUrl: string
    user: string
    password: string
    host: string
  }
}

export interface TemplateApiModuleActionProps {
  application: ApplicationWithAttachments
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

@Injectable()
export abstract class BaseTemplateApiApplicationService {
  abstract saveAttachmentToApplicaton(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string>

  abstract storeNonceForApplication(application: Application): Promise<string>

  abstract createAssignToken(
    application: Application,
    secret: string,
    expiresIn: number,
  ): Promise<string>
}
