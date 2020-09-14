import * as templates from './templates/'
import { ApplicationTypes } from './types/ApplicationTypes'
import { Application } from './types/Application'
import {
  ApplicationContext,
  ApplicationStateMeta,
  ApplicationStateSchema,
} from './types/StateMachine'
import { EventObject } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTemplateHelper,
} from './templates/ApplicationTemplate'

export function getApplicationTemplateByTypeId<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
>(
  templateId: ApplicationTypes,
): ApplicationTemplate<TContext, TStateSchema, TEvents> | null {
  return templates[templateId] || null
}

export function getApplicationStateInformation(
  application: Application,
): ApplicationStateMeta | null {
  const template = getApplicationTemplateByTypeId(application.typeId)
  if (!template) {
    return null
  }
  const helper = new ApplicationTemplateHelper(application, template)
  return helper.getApplicationStateInformation()
}
