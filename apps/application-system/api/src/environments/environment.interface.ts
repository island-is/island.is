import type { AuthConfig } from '@island.is/auth-nest-tools'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'
import { AuditOptions } from '@island.is/nest/audit'
import { SmsServiceOptions } from '@island.is/nova-sms'

export interface Environment {
  production: boolean
  environment: string
  name: string
  baseApiUrl: string
  audit: AuditOptions
  auth: AuthConfig
  templateApi: TemplateAPIConfig
  smsOptions: SmsServiceOptions
  contentful: {
    accessToken: string
  }
}
