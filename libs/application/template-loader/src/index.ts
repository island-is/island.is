import {
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  ApplicationContext,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationTemplateHelper,
  FieldBaseProps,
} from '@island.is/application/core'
import { EventObject } from 'xstate'
import templateLoaders from './lib/templateLoaders'
import { FC } from 'react'

type UIFields = Record<string, FC<FieldBaseProps>>
type TemplateLibraryModule = {
  default: unknown
  getFields?: () => Promise<UIFields>
}
const loadedTemplateLibs: Record<string, TemplateLibraryModule> = {}

async function loadTemplateLib(
  templateId: ApplicationTypes,
): Promise<TemplateLibraryModule> {
  const loadedTemplateLib = loadedTemplateLibs[templateId]
  if (loadedTemplateLib !== undefined) {
    return loadedTemplateLib
  }
  try {
    const templateLib = (await templateLoaders[
      templateId
    ]()) as TemplateLibraryModule
    loadedTemplateLibs[templateId] = templateLib
    return templateLib
  } catch (e) {
    return Promise.reject(`Could not load template with id ${templateId}`)
  }
}

export async function getApplicationTemplateByTypeId<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
>(
  templateId: ApplicationTypes,
): Promise<ApplicationTemplate<TContext, TStateSchema, TEvents>> {
  const templateLib = await loadTemplateLib(templateId)
  return templateLib.default as ApplicationTemplate<
    TContext,
    TStateSchema,
    TEvents
  >
}

export async function getApplicationUIFields(
  templateId: ApplicationTypes,
): Promise<UIFields> {
  const templateLib = await loadTemplateLib(templateId)
  if (templateLib.getFields) {
    return await templateLib.getFields()
  }
  return Promise.resolve({})
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
