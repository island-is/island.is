import { AuthConfig } from '@island.is/auth-nest-tools'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'
import { ApplicationConfig } from '../app/modules/application/application.configuration'
import { FileStorageConfig } from '@island.is/file-storage'
import { SigningServiceOptions } from '@island.is/dokobit-signing'

export interface Environment {
  production: boolean
  environment: string
  baseApiUrl: string
  redis: {
    urls: string[]
  }
  auth: AuthConfig
  templateApi: TemplateAPIConfig
  application: ApplicationConfig
  fileStorage: FileStorageConfig
  signingOptions: SigningServiceOptions
}
