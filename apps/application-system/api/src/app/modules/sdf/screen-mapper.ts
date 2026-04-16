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

const mapFieldType = (fieldType: string): string => fieldType

const resolveFieldProp = <T,>(
  prop: T | ((...args: any[]) => T) | undefined,
  ...args: any[]
): T | undefined => {
  if (typeof prop === 'function') {
    try {
      return (prop as (...a: any[]) => T)(...args)
    } catch {
      return undefined
    }
  }
  return prop
}

const mapFieldToComponent = (
  field: FieldDef,
  resolver: FormTextResolver,
  application: any,
): ComponentDto => {
  const raw = field as any

  const component: ComponentDto = {
    id: field.id,
    type: mapFieldType(raw.type as string),
    label: resolver.resolve(raw.title),
    required: (resolveFieldProp(raw.required, application) as boolean) ?? false,
    disabled: (resolveFieldProp(raw.disabled, application) as boolean) ?? false,
    defaultValue: resolveFieldProp(raw.defaultValue, application),
    width: raw.width === 'half' ? 'HALF' : 'FULL',
    clientCondition: extractClientCondition(raw.condition),
  }

  if (raw.placeholder) {
    component.placeholder = resolver.resolve(raw.placeholder)
  } else if (raw.description) {
    component.placeholder = resolver.resolve(raw.description)
  }

  if (raw.options) {
    const opts = resolveFieldProp(raw.options, application)
    component.options = opts
  }

  switch (raw.type) {
    case FieldTypes.CUSTOM:
      component.componentName = raw.component
      try {
        const propsValue = resolveFieldProp(raw.props, application)
        component.props = propsValue ? JSON.stringify(propsValue) : undefined
      } catch {
        component.props = undefined
      }
      break

    case FieldTypes.ALERT_MESSAGE:
      component.title = resolver.resolve(raw.title) || ''
      component.message = resolver.resolve(raw.message)
      component.alertType = raw.alertType ?? 'info'
      break

    case FieldTypes.KEY_VALUE:
      component.value = resolver.resolve(
        resolveFieldProp(raw.value, application),
      )
      break

    case FieldTypes.LINK:
      component.url = resolver.resolve(raw.link) || ''
      break

    case FieldTypes.SUBMIT: {
      component.placement = raw.placement ?? 'footer'
      const actions = resolveFieldProp(raw.actions, application) as
        | Array<{ event: string; name: string; type: string }>
        | undefined
      component.actions = (actions ?? []).map((a) => ({
        event: a.event ?? '',
        name: resolver.resolve(a.name as any) || a.name || '',
        type: a.type ?? 'primary',
      }))
      break
    }

    case FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD:
      component.message = resolver.resolve(raw.message) || ''
      component.url = raw.url ?? ''
      component.buttonTitle = resolver.resolve(raw.buttonTitle) || ''
      break

    case FieldTypes.EXPANDABLE_DESCRIPTION:
      component.description = resolver.resolve(raw.description) || ''
      component.introText = resolver.resolve(raw.introText)
      break

    case FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE:
      component.watchValue = raw.watchValue ?? ''
      break

    case FieldTypes.SLIDER:
      component.min = raw.min ?? 0
      component.max =
        (resolveFieldProp(raw.max, application) as number) ?? 100
      component.step = raw.step
      break

    case FieldTypes.STATIC_TABLE: {
      const header = resolveFieldProp(raw.header, application)
      const rows = resolveFieldProp(raw.rows, application)
      component.header = Array.isArray(header)
        ? header.map((h: any) => resolver.resolve(h))
        : []
      component.rows = Array.isArray(rows)
        ? rows.map((row: any[]) => row.map((c: any) => resolver.resolve(c)))
        : []
      break
    }

    case FieldTypes.ACCORDION: {
      const accordionItems = resolveFieldProp(
        raw.accordionItems,
        application,
      ) as Array<{ itemTitle: any; itemContent?: any }> | undefined
      component.items = (accordionItems ?? []).map((item) => ({
        label: resolver.resolve(item.itemTitle) || '',
        content: resolver.resolve(item.itemContent) || '',
      }))
      break
    }

    case FieldTypes.DATE:
      component.minDate = raw.minDate
      component.maxDate = raw.maxDate
      break

    case FieldTypes.TEXT:
      component.maxLength = raw.maxLength
      break

    case FieldTypes.FILEUPLOAD:
      component.maxSize = raw.maxSize
      component.accept = raw.uploadAccept
      break

    case FieldTypes.IMAGE:
      component.imageUrl =
        typeof raw.image === 'string' ? raw.image : undefined
      break

    case FieldTypes.DISPLAY:
      component.value = resolver.resolve(
        resolveFieldProp(raw.value, application?.answers, application?.externalData),
      )
      break
  }

  return component
}

const mapMultiFieldToComponents = (
  screen: MultiFieldScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto[] => {
  return screen.children
    .filter((child) => (child as FieldDef).isNavigable !== false)
    .map((child) => mapFieldToComponent(child as FieldDef, resolver, application))
}

const mapRepeaterToComponent = (
  screen: RepeaterScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto => {
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

const mapExternalDataProviderToComponent = (
  screen: ExternalDataProviderScreen,
  resolver: FormTextResolver,
): ComponentDto => {
  const raw = screen as any
  const dataProviders = raw.dataProviders?.map((dp: any) => ({
    id: dp.id,
    title: resolver.resolve(dp.title) || dp.id,
    subTitle: dp.subTitle ? resolver.resolve(dp.subTitle) : undefined,
  }))

  const component: any = {
    id: screen.id ?? 'external-data',
    type: 'EXTERNAL_DATA_PROVIDER',
    label: resolver.resolve(raw.title),
  }

  if (raw.subTitle) {
    component.subTitle = resolver.resolve(raw.subTitle)
  }
  if (raw.description) {
    component.description = resolver.resolve(raw.description)
  }
  if (raw.checkboxLabel) {
    component.checkboxLabel = resolver.resolve(raw.checkboxLabel)
  }
  if (dataProviders && dataProviders.length > 0) {
    component.dataProviders = dataProviders
  }

  return component as ComponentDto
}

export const mapScreenToComponents = (
  screen: FormScreen,
  resolver: FormTextResolver,
  application: any,
): ComponentDto[] => {
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
