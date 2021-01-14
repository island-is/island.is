import { Application } from './Application'

export type ApplicationTemplateAPIModuleAction = (
  application: Application,
) => Promise<unknown>

export interface ApplicationTemplateAPIModule {
  [action: string]: ApplicationTemplateAPIModuleAction
}
