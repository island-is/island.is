import {
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  ApplicationContext,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationTemplateHelper,
} from '@island.is/application/template'
import { EventObject } from 'xstate'
import templateLoaders from './lib/templateLoaders'

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
    const template = (await templateLoaders[
      templateId
    ]()) as ApplicationTemplate<TContext, TStateSchema, TEvents>
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
