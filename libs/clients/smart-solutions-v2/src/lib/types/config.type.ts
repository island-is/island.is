export interface SmartSolutionsModuleOptions {
  config: SmartSolutionsConfig
}

export interface SmartSolutionsConfig {
  apiKey: string
  apiUrl: string
  passTemplateId?: string
}

export const GRAPHQL_CLIENT_FACTORY = 'grahpql-client-factory'

/** Category to attach each log message to */
export const LOG_CATEGORY = 'clients-smart-solutions-v2'
