import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  ApplicationContext,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationConfigurations,
  FieldBaseProps,
  RepeaterProps,
  BasicDataProvider,
} from '@island.is/application/types'
import { EventObject } from 'xstate'
import templateLoaders from './lib/templateLoaders'
import { FC } from 'react'

type UIFields = Record<
  string,
  FC<React.PropsWithChildren<FieldBaseProps | RepeaterProps>>
>
type TemplateLibraryModule = {
  default: unknown
  getDataProviders?: () => Promise<Record<string, new () => BasicDataProvider>>
  getFields?: () => Promise<UIFields>
}
const loadedTemplateLibs: Record<string, TemplateLibraryModule> = {}

const loadTemplateLib = async (
  templateId: ApplicationTypes,
): Promise<TemplateLibraryModule> => {
  const hasLoadedTemplateLib = Object.prototype.hasOwnProperty.call(
    loadedTemplateLibs,
    templateId,
  )
  if (hasLoadedTemplateLib) {
    return loadedTemplateLibs[templateId]
  }

  const hasTemplateLoader =
    Object.prototype.hasOwnProperty.call(templateLoaders, templateId) &&
    typeof templateLoaders[templateId] === 'function'
  if (!hasTemplateLoader) {
    throw new Error(`No template exists with id ${templateId}`)
  }

  try {
    const templateLoader = templateLoaders[templateId]
    const templateLib = (await templateLoader()) as TemplateLibraryModule
    loadedTemplateLibs[templateId] = templateLib
    return templateLib
  } catch (e) {
    throw new Error(`Could not load template with id ${templateId}`)
  }
}

export const getApplicationTemplateByTypeId = async <
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
>(
  templateId: ApplicationTypes,
): Promise<ApplicationTemplate<TContext, TStateSchema, TEvents>> => {
  const templateLib = await loadTemplateLib(templateId)
  return templateLib.default as ApplicationTemplate<
    TContext,
    TStateSchema,
    TEvents
  >
}

export const getApplicationUIFields = async (
  templateId: ApplicationTypes,
): Promise<UIFields> => {
  const templateLib = await loadTemplateLib(templateId)
  if (templateLib.getFields) {
    return await templateLib.getFields()
  }
  return Promise.resolve({})
}

export const getApplicationDataProviders = async (
  templateId: ApplicationTypes,
): Promise<Record<string, new () => BasicDataProvider>> => {
  const templateLib = await loadTemplateLib(templateId)
  if (templateLib.getDataProviders) {
    return await templateLib.getDataProviders()
  }
  return Promise.resolve({})
}

export const getApplicationStateInformation = async (
  application: Application,
): Promise<ApplicationStateMeta | null> => {
  const template = await getApplicationTemplateByTypeId(application.typeId)
  if (!template) {
    return null
  }
  const helper = new ApplicationTemplateHelper(application, template)
  return helper.getApplicationStateInformation() || null
}

export const getApplicationTranslationNamespaces = async (
  application: Application,
): Promise<string[]> => {
  const template = await getApplicationTemplateByTypeId(application.typeId)
  const translationNamespaces = ([] as string[])
    .concat(ApplicationConfigurations[application.typeId].translation)
    .concat(template?.translationNamespaces ?? [])

  // We load the core namespace for the application system + the ones defined in the application template
  return [...new Set(['application.system', ...translationNamespaces])] // Remove duplicates
}
