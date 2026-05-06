import { Application, FormItemTypes } from '@island.is/application/types'
import type { Condition } from '@island.is/application/types'
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
import { asResolvableFormText, mapFieldToComponent } from './field-mappers'

/**
 * Screen compiler marks fields hidden by `showWhen` as `isNavigable: false` but still
 * lists them on the multi-field screen. The SDF client must receive those fields so
 * `evaluateClientCondition` can reveal them when answers change — otherwise they only
 * appear after a navigation round-trip once the server rebuilds with persisted answers.
 *
 * We treat Tier-1 static checks as "emit if `questionId` is present" even if
 * `extractClientCondition` were to fail on an unusual shape — the mapper still
 * attaches `clientCondition` when extraction succeeds.
 */
const shouldIncludeMultiFieldChildForSdf = (child: FieldDef): boolean => {
  if (child.isNavigable !== false) {
    return true
  }
  const condition = (child as unknown as Record<string, unknown>)['condition']
  if (condition == null || typeof condition === 'function') {
    return false
  }
  if (typeof condition !== 'object') {
    return false
  }
  const o = condition as Record<string, unknown>
  if (o.isMultiCheck === true) {
    return extractClientCondition(condition as Condition) != null
  }
  if (typeof o.questionId === 'string' && o.questionId.length > 0) {
    return true
  }
  if (typeof o.externalDataId === 'string' && o.externalDataId.length > 0) {
    return true
  }
  if (typeof o.userPropId === 'string' && o.userPropId.length > 0) {
    return true
  }
  return extractClientCondition(condition as Condition) != null
}

const mapMultiFieldToComponents = (
  screen: MultiFieldScreen,
  resolver: FormTextResolver,
  application: Application,
): ComponentDto[] => {
  return screen.children
    .filter(shouldIncludeMultiFieldChildForSdf)
    .map((child) => mapFieldToComponent(child as FieldDef, resolver, application))
}

type RepeaterScreenWithLabels = RepeaterScreen & {
  addItemLabel?: unknown
  removeItemLabel?: unknown
  minItems?: number
  maxItems?: number
}

const mapRepeaterToComponent = (
  screen: RepeaterScreen,
  resolver: FormTextResolver,
  application: Application,
): ComponentDto => {
  const repeater = screen as RepeaterScreenWithLabels
  const itemGroups: ComponentDto[][] = []

  if (screen.children) {
    for (const child of screen.children) {
      if (
        'type' in child &&
        (child as { type?: string }).type === FormItemTypes.MULTI_FIELD
      ) {
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
    addItemLabel:
      resolver.resolve(asResolvableFormText(repeater.addItemLabel)) || 'Add',
    removeItemLabel:
      resolver.resolve(asResolvableFormText(repeater.removeItemLabel)) ||
      undefined,
    minItems: repeater.minItems,
    maxItems: repeater.maxItems,
    children: itemGroups,
  }
}

const mapExternalDataProviderToComponent = (
  screen: ExternalDataProviderScreen,
  resolver: FormTextResolver,
): ComponentDto => {
  const dataProviders = screen.dataProviders?.map((dp) => ({
    id: dp.id,
    title: resolver.resolve(dp.title) || dp.id,
    subTitle: dp.subTitle ? resolver.resolve(dp.subTitle) : undefined,
  }))

  const component: ComponentDto = {
    id: screen.id ?? 'external-data',
    type: 'EXTERNAL_DATA_PROVIDER',
    label: resolver.resolve(asResolvableFormText(screen.title)),
  }

  if (screen.subTitle) {
    component.subTitle = resolver.resolve(asResolvableFormText(screen.subTitle))
  }
  if (screen.description) {
    component.description = resolver.resolve(
      asResolvableFormText(screen.description),
    )
  }
  if (screen.checkboxLabel) {
    component.checkboxLabel = resolver.resolve(
      asResolvableFormText(screen.checkboxLabel),
    )
  }
  if (dataProviders && dataProviders.length > 0) {
    component.dataProviders = dataProviders
  }

  return component
}

export const mapScreenToComponents = (
  screen: FormScreen,
  resolver: FormTextResolver,
  application: Application,
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
