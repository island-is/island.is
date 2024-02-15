import { Pass } from '../../gen/schema'

export interface SmartSolutionsModuleOptions {
  config: SmartSolutionsConfig
}

export interface SmartSolutionsConfig {
  apiKey: string
  apiUrl: string
  passTemplateId?: string
}

export interface VerifyPassResponse {
  valid: boolean
  data?: PkPass
}

export type PkPass = Partial<Pass>

export const APOLLO_CLIENT_FACTORY = 'apollo-client-factory'

/** Category to attach each log message to */
export const LOG_CATEGORY = 'client-smart-solutions'
