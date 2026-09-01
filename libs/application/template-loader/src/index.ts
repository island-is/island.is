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
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { EventObject } from 'xstate'
import templateLoaders from './lib/templateLoaders'
import { FC } from 'react'

type UIFields = Record<
  string,
  FC<React.PropsWithChildren<FieldBaseProps | RepeaterProps>>
>

/**
 * Message shape for optional `getCustomFieldMessageDescriptors` (admin Translation Workspace).
 * Keys must match `CustomField.component` in the form; values are descriptors used only in that component subtree.
 */
export type CustomFieldMessageDescriptorInfo = {
  id: string
  defaultMessage?: string
  description?: string
}

/**
 * Optional answers / externalData for Translation Workspace custom-field preview.
 * Custom components often read `application.externalData.*.data` and crash on the
 * empty stub application the workspace uses by default.
 */
export type TranslationWorkspacePreviewApplicationData = {
  answers?: FormValue
  externalData?: ExternalData
}

type TemplateLibraryModule = {
  default: unknown
  getDataProviders?: () => Promise<Record<string, new () => BasicDataProvider>>
  getFields?: () => Promise<UIFields>
  getCustomFieldMessageDescriptors?: () => Promise<
    Record<string, CustomFieldMessageDescriptorInfo[]>
  >
  getTranslationWorkspacePreviewApplication?: () => Promise<TranslationWorkspacePreviewApplicationData>
}

const TEMPLATE_LIB_NON_MESSAGE_EXPORTS = new Set([
  'default',
  '__esModule',
  'getDataProviders',
  'getFields',
  'getCustomFieldMessageDescriptors',
  'getTranslationWorkspacePreviewApplication',
])

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

/**
 * Optional manifest of translation descriptors for `CUSTOM` fields, keyed by `field.component`.
 * Used by Translation Workspace introspection when `getCustomFieldMessageDescriptors` is exported from the template library.
 */
export const getApplicationCustomFieldMessageDescriptors = async (
  templateId: ApplicationTypes,
): Promise<Record<string, CustomFieldMessageDescriptorInfo[]>> => {
  const templateLib = await loadTemplateLib(templateId)
  if (templateLib.getCustomFieldMessageDescriptors) {
    return await templateLib.getCustomFieldMessageDescriptors()
  }
  return {}
}

/**
 * Optional mock `answers` / `externalData` for Translation Workspace preview.
 * Used so `CUSTOM` field components can render without live national-registry data.
 */
export const getApplicationTranslationWorkspacePreview = async (
  templateId: ApplicationTypes,
): Promise<TranslationWorkspacePreviewApplicationData> => {
  const templateLib = await loadTemplateLib(templateId)
  if (templateLib.getTranslationWorkspacePreviewApplication) {
    return await templateLib.getTranslationWorkspacePreviewApplication()
  }
  return {}
}

/**
 * Message-module roots for Translation Workspace.
 * Uses named template-library exports (typically `export * from './lib/messages'`).
 */
export const getApplicationMessageRoots = async (
  templateId: ApplicationTypes,
): Promise<unknown[]> => {
  const templateLib = await loadTemplateLib(templateId)
  const roots: unknown[] = []
  for (const [key, value] of Object.entries(templateLib)) {
    if (TEMPLATE_LIB_NON_MESSAGE_EXPORTS.has(key)) continue
    if (typeof value === 'function') continue
    roots.push(value)
  }
  return roots
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
