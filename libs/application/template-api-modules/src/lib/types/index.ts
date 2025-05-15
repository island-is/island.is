import { Injectable, Type } from '@nestjs/common'

import {
  Application,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { Message } from '@island.is/email-service'

import type { Locale } from '@island.is/shared/types'
import { sharedModuleConfig } from '../modules/shared'
import { ConfigType } from '@nestjs/config'

export interface BaseTemplateAPIModuleConfig {
  xRoadBasePathWithEnv: string
  jwtSecret: string
  clientLocationOrigin: string
  baseApiUrl: string
  email: {
    sender: string
    address: string
  }
  attachmentBucket: string
  presignBucket: string
  generalPetition: {
    endorsementsApiBasePath: string
  }
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

export interface SharedModuleConfig
  extends ConfigType<typeof sharedModuleConfig> {}

export interface TemplateApiModuleActionProps<Params = unknown> {
  application: ApplicationWithAttachments
  auth: User
  currentUserLocale: Locale
  params?: Params
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
  abstract saveAttachmentToApplication(
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

export type SmsTemplateGenerator = (
  application: Application,
  options: {
    clientLocationOrigin: string
  },
) => SmsMessage

export type AssignmentSmsTemplateGenerator = (
  application: Application,
  assignLink: string,
) => SmsMessage

export interface SmsMessage {
  phoneNumber: string
  message: string
}
