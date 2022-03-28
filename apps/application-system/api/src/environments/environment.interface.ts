import type { AuthConfig } from '@island.is/auth-nest-tools'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'
import { FileStorageConfig } from '@island.is/file-storage'
import { SigningServiceOptions } from '@island.is/dokobit-signing'
import { AuditOptions } from '@island.is/nest/audit'
import { SmsServiceOptions } from '@island.is/nova-sms'
import { ApplicationConfig } from '../app/modules/application/application.configuration'

export interface Environment {
  production: boolean
  environment: string
  sentryDsn: string
  name: string
  baseApiUrl: string
  redis: {
    urls: string[]
  }
  audit: AuditOptions
  auth: AuthConfig
  templateApi: TemplateAPIConfig
  application: ApplicationConfig
  fileStorage: FileStorageConfig
  signingOptions: SigningServiceOptions
  smsOptions: SmsServiceOptions
  contentful: {
    accessToken: string
  }
}
