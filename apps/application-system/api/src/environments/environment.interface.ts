import { AuthConfig } from '@island.is/auth-nest-tools'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'
import { ApplicationConfig } from '../app/modules/application/application.configuration'
import { FileStorageConfig } from '@island.is/file-storage'
import { SigningServiceOptions } from '@island.is/dokobit-signing'
import { AuditOptions } from '@island.is/nest/audit'
import { SmsServiceOptions } from '@island.is/nova-sms'

export interface Environment {
  production: boolean
  environment: string
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
}
