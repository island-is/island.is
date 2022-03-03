import { Injectable, Type } from '@nestjs/common'

import { Config as CriminalRecordConfig } from '@island.is/api/domains/criminal-record'
import { Config as DrivingLicenseApiConfig } from '@island.is/api/domains/driving-license'
import {
  Application,
  ApplicationWithAttachments,
} from '@island.is/application/core'
import { User } from '@island.is/auth-nest-tools'
import { DataProtectionComplaintClientConfig } from '@island.is/clients/data-protection-complaint'
import { HealthInsuranceV2Options } from '@island.is/clients/health-insurance-v2'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { PaymentScheduleServiceOptions } from '@island.is/clients/payment-schedule'
import { Message } from '@island.is/email-service'

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
}
