import { FieldTypes } from '@island.is/application/types'
import { FieldDef } from '@island.is/application/screen-compiler'

import { extractClientCondition } from '../condition-hint'
import { ComponentDto } from '../dto/screen.dto'
import {
  FieldMapperContext,
  FieldMapperRaw,
  ResolvableFormText,
} from './types'

/** Values passed to `FormTextResolver.resolve` from compiled field props (template-driven). */
export const asResolvableFormText = (value: unknown): ResolvableFormText =>
  value as ResolvableFormText

export const mapFieldType = (fieldType: string): string => fieldType

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Field props may be values or template callbacks with application-specific
 * signatures; `unknown[]` keeps that flexible without leaking unsafe types.
 */
export const resolveFieldProp = <T,>(
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
  { application, resolver }: FieldMapperContext,
): ComponentDto => ({
  id: field.id,
  type: mapFieldType(raw.type as string),
  label: resolver.resolve(raw.title),
  required: (resolveFieldProp(raw.required, application) as boolean) ?? false,
  disabled: (resolveFieldProp(raw.disabled, application) as boolean) ?? false,
  defaultValue: resolveFieldProp(raw.defaultValue, application),
  width: raw.width === 'half' ? 'HALF' : 'FULL',
  clientCondition: extractClientCondition(raw.condition),
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
    raw.type !== FieldTypes.DESCRIPTION
  ) {
    // CHECKBOX and DESCRIPTION use description as rendered copy, not placeholder text.
    component.placeholder = resolver.resolve(raw.description)
  }

  if (raw.options) {
    component.options = resolveFieldProp(raw.options, application)
  }

  if (typeof raw.marginTop === 'number') {
    component.marginTop = raw.marginTop
  }
  if (typeof raw.marginBottom === 'number') {
    component.marginBottom = raw.marginBottom
  }
}
