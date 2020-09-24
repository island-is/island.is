import * as templates from './templates/'
import { ApplicationTypes } from './types/ApplicationTypes'
import { ApplicationTemplate } from './types/ApplicationTemplate'
import { Application } from './types/Application'
import {
  ApplicationContext,
  ApplicationStateMeta,
  ApplicationStateSchema,
} from './types/StateMachine'
import { EventObject } from 'xstate'
import { ApplicationTemplateHelper } from './templates/ApplicationTemplateHelper'

export function getApplicationTemplateByTypeId<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
>(
  templateId: ApplicationTypes,
): ApplicationTemplate<TContext, TStateSchema, TEvents> | null {
  return (
    (templates as Record<
      string,
      ApplicationTemplate<TContext, TStateSchema, TEvents>
    >)[templateId] || null
  )
}

export function getApplicationStateInformation(
  application: Application,
): ApplicationStateMeta | null {
  const template = getApplicationTemplateByTypeId(application.typeId)
  if (!template) {
    return null
  }
  const helper = new ApplicationTemplateHelper(application, template)
  return helper.getApplicationStateInformation() || null
}
