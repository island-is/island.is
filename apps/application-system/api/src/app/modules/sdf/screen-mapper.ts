import {
  Field,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'
import {
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
  ExternalDataProviderScreen,
} from '@island.is/application/screen-compiler'
import { ComponentDto } from './dto/screen.dto'
import { extractClientCondition } from './condition-hint'
import { FormTextResolver } from './i18n-resolver.service'

function mapFieldType(fieldType: string): string {
  return fieldType
}

function resolveFieldProp<T>(
  prop: T | ((...args: any[]) => T) | undefined,
  ...args: any[]
): T | undefined {
  if (typeof prop === 'function') {
    try {
      return (prop as (...a: any[]) => T)(...args)
    } catch {
      return undefined
    }
  }
  return prop
}

function mapFieldToComponent(
  field: FieldDef,
  resolver: FormTextResolver,
  application: any,
): ComponentDto {
  const raw = field as any

  const component: ComponentDto = {
    id: field.id,
    type: mapFieldType(raw.type as string),
    label: resolver.resolve(raw.title),
    required: resolveFieldProp(raw.required, application) as
      | boolean
      | undefined,
    disabled: resolveFieldProp(raw.disabled, application) as
      | boolean
      | undefined,
    defaultValue: resolveFieldProp(raw.defaultValue, application),
    width: raw.width === 'half' ? 'HALF' : 'FULL',
    clientCondition: extractClientCondition(raw.condition),
  }

  if (raw.description) {
    component.placeholder = resolver.resolve(raw.description)
  }

  if (raw.type === FieldTypes.CUSTOM) {
    component.componentName = raw.component
    try {
      const propsValue = resolveFieldProp(raw.props, application)
      component.props = propsValue ? JSON.stringify(propsValue) : undefined
    } catch {
      component.props = undefined
    }
  }

  if (raw.options) {
    const opts = resolveFieldProp(raw.options, application)
    component.options = opts
  }

  return component
}

function mapMultiFieldToComponents(
  screen: MultiFieldScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto[] {
  return screen.children
    .filter((child) => (child as FieldDef).isNavigable !== false)
    .map((child) => mapFieldToComponent(child as FieldDef, resolver, application))
}

function mapRepeaterToComponent(
  screen: RepeaterScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto {
  const repeater = screen as any
  const itemGroups: ComponentDto[][] = []

  if (screen.children) {
    for (const child of screen.children) {
      if ('type' in child && (child as any).type === FormItemTypes.MULTI_FIELD) {
        const mf = child as MultiFieldScreen
        const group = mapMultiFieldToComponents(mf, resolver, application)
        itemGroups.push(group)
      } else if ('type' in child) {
        const group = [
          mapFieldToComponent(child as FieldDef, resolver, application),
        ]
        itemGroups.push(group)
      }
    }
  }

  return {
    id: screen.id ?? 'repeater',
    type: 'REPEATER',
    arrayPath: screen.id,
    addItemLabel: resolver.resolve(repeater.addItemLabel) || 'Add',
    removeItemLabel: resolver.resolve(repeater.removeItemLabel) || undefined,
    minItems: repeater.minItems,
    maxItems: repeater.maxItems,
    children: itemGroups,
  }
}

function mapExternalDataProviderToComponent(
  screen: ExternalDataProviderScreen,
  resolver: FormTextResolver,
): ComponentDto {
  return {
    id: screen.id ?? 'external-data',
    type: 'EXTERNAL_DATA_PROVIDER',
    label: resolver.resolve((screen as any).title),
  }
}

export function mapScreenToComponents(
  screen: FormScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto[] {
  if ('type' in screen) {
    switch (screen.type) {
      case FormItemTypes.MULTI_FIELD:
        return mapMultiFieldToComponents(
          screen as MultiFieldScreen,
          resolver,
          application,
        )
      case FormItemTypes.REPEATER:
        return [
          mapRepeaterToComponent(
            screen as RepeaterScreen,
            resolver,
            application,
          ),
        ]
      case FormItemTypes.EXTERNAL_DATA_PROVIDER:
        return [
          mapExternalDataProviderToComponent(
            screen as ExternalDataProviderScreen,
            resolver,
          ),
        ]
      default:
        return [mapFieldToComponent(screen as FieldDef, resolver, application)]
    }
  }

  return [mapFieldToComponent(screen as FieldDef, resolver, application)]
}
