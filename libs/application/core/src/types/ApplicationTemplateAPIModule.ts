import { Application } from './Application'

export type ApplicationTemplateAPIModuleAction = (
  application: Application,
  authorization: string,
) => Promise<unknown>

export interface ApplicationTemplateAPIModule {
  [action: string]: ApplicationTemplateAPIModuleAction
}
