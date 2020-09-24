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

const loadedTemplates: Record<string, unknown> = {}

export async function getApplicationTemplateByTypeId<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
>(
  templateId: ApplicationTypes,
): Promise<ApplicationTemplate<TContext, TStateSchema, TEvents>> {
  const loadedTemplate = loadedTemplates[templateId]
  if (loadedTemplate !== undefined) {
    return loadedTemplate as ApplicationTemplate<
      TContext,
      TStateSchema,
      TEvents
    >
  }
  try {
    const template = (await import(`./templates/${templateId}`)).default
    loadedTemplates[templateId] = template
    return template
  } catch (e) {
    return Promise.reject(`No template found with id ${templateId}`)
  }
}

export async function getApplicationStateInformation(
  application: Application,
): Promise<ApplicationStateMeta | null> {
  const template = await getApplicationTemplateByTypeId(application.typeId)
  if (!template) {
    return null
  }
  const helper = new ApplicationTemplateHelper(application, template)
  return helper.getApplicationStateInformation() || null
}
