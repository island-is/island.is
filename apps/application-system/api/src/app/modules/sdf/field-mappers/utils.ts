import { FieldTypes } from '@island.is/application/types'
import { resolveFormItemId } from '@island.is/application/core'
import { FieldDef } from '@island.is/application/screen-compiler'

import { ComponentDto } from '../dto/screen.dto'
import { FieldMapperContext, FieldMapperRaw, ResolvableFormText } from './types'

/** Values passed to `FormTextResolver.resolve` from compiled field props (template-driven). */
export const asResolvableFormText = (value: unknown): ResolvableFormText =>
  value as ResolvableFormText

export const mapFieldType = (fieldType: string): string => fieldType

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Mirrors the legacy `OverviewFormField` empty check used for `hideIfEmpty`. */
export const isEmpty = (value: unknown): boolean => {
  if (!value) return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

/**
 * Field props may be values or template callbacks with application-specific
 * signatures; `unknown[]` keeps that flexible without leaking unsafe types.
 */
export const resolveFieldProp = <T>(
  prop: T | ((...args: unknown[]) => T) | undefined,
  ...args: unknown[]
): T | undefined => {
  if (typeof prop === 'function') {
    try {
      return (prop as (...a: unknown[]) => T)(...args)
    } catch {
      return undefined
    }
  }
  return prop
}

export const formatDateFieldBoundary = (
  value: Date | string | undefined,
): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value)
}

export const applyRefetchMetadata = (
  component: ComponentDto,
  raw: FieldMapperRaw,
): void => {
  const apis = raw.inlineRefetchTemplateApis
  if (Array.isArray(apis) && apis.length > 0) {
    component.onSelectRefetchTemplateApis = apis as string[]
  }

  const refetchTargets = raw.refetchTargets
  if (Array.isArray(refetchTargets) && refetchTargets.length > 0) {
    component.refetchTargets = refetchTargets as string[]
  }
}

export const createBaseComponent = (
  field: FieldDef,
  raw: FieldMapperRaw,
  { application, resolver, user }: FieldMapperContext,
): ComponentDto => ({
  id: resolveFormItemId(field, application, user),
  type: mapFieldType(raw.type as string),
  label: resolver.resolve(raw.title),
  required: (resolveFieldProp(raw.required, application) as boolean) ?? false,
  disabled: (resolveFieldProp(raw.disabled, application) as boolean) ?? false,
  defaultValue: resolveFieldProp(raw.defaultValue, application),
  width: raw.width === 'half' ? 'HALF' : 'FULL',
  clientShowWhen: raw.clientShowWhen as ComponentDto['clientShowWhen'],
})

export const applySharedFieldProps = (
  component: ComponentDto,
  raw: FieldMapperRaw,
  { application, resolver }: FieldMapperContext,
): void => {
  if (raw.placeholder) {
    component.placeholder = resolver.resolve(raw.placeholder)
  } else if (
    raw.description &&
    raw.type !== FieldTypes.CHECKBOX &&
    raw.type !== FieldTypes.DESCRIPTION &&
    raw.type !== FieldTypes.FILEUPLOAD
  ) {
    // CHECKBOX, DESCRIPTION, and FILEUPLOAD render `description` as their own
    // copy block, not as input placeholder text.
    component.placeholder = resolver.resolve(raw.description)
  }

  if (raw.options) {
    const resolvedOptions = resolveFieldProp(raw.options, application)
    component.options = Array.isArray(resolvedOptions)
      ? resolvedOptions.map((option) =>
          isRecord(option)
            ? {
                ...option,
                label: resolver.resolve(asResolvableFormText(option.label)),
              }
            : option,
        )
      : resolvedOptions
  }

  if (typeof raw.marginTop === 'number') {
    component.marginTop = raw.marginTop
  }
  if (typeof raw.marginBottom === 'number') {
    component.marginBottom = raw.marginBottom
  }
}
