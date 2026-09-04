import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import type { ApplicationTypes } from '@island.is/application/types'
import type { StaticText } from '@island.is/application/types'
import {
  extractStaticText,
  tryInvokeFormTextFunction,
} from './message-descriptor.util'

export const resolveTemplateDisplayName = (
  template: { name?: unknown },
  fallback: string,
): string => {
  if (typeof template.name === 'function') {
    const { staticText } = tryInvokeFormTextFunction(template.name as Function)
    return staticText ?? fallback
  }
  return extractStaticText(template.name as StaticText) ?? fallback
}

const templateDisplayNameCache = new Map<string, string>()

export const getTemplateDisplayName = async (
  typeId: ApplicationTypes,
  fallback: string,
): Promise<string> => {
  const cached = templateDisplayNameCache.get(typeId)
  if (cached) {
    return cached
  }

  try {
    const template = await getApplicationTemplateByTypeId(typeId)
    const name = resolveTemplateDisplayName(template, fallback)
    templateDisplayNameCache.set(typeId, name)
    return name
  } catch {
    templateDisplayNameCache.set(typeId, fallback)
    return fallback
  }
}
