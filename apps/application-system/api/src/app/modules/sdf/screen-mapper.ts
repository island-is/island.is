import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  FieldTypes,
  FormItemTypes,
  FormText,
  FormTextWithLocale,
  StaticText,
} from '@island.is/application/types'
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

type ResolvableFormText = FormText | FormTextWithLocale | StaticText | undefined

/** Values passed to `FormTextResolver.resolve` from compiled field props (template-driven). */
const asResolvableFormText = (value: unknown): ResolvableFormText =>
  value as ResolvableFormText

const mapFieldType = (fieldType: string): string => fieldType

type PaymentCatalogRow = {
  priceAmount: number
  chargeItemName: string
  chargeItemCode: string
}

type PaymentChargeOverviewRaw = {
  forPaymentLabel?: unknown
  totalLabel?: unknown
  getSelectedChargeItems?: (app: unknown) => unknown[]
}

type SelectedChargeListItem = {
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: unknown
}

const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

const buildPaymentChargeOverviewFields = (
  raw: PaymentChargeOverviewRaw,
  application: Application,
  resolver: FormTextResolver,
): Pick<
  ComponentDto,
  | 'paymentChargeHeading'
  | 'paymentChargeLines'
  | 'paymentChargeTotalLabel'
  | 'paymentChargeTotalAmount'
> => {
  const heading =
    resolver.resolve(asResolvableFormText(raw.forPaymentLabel)) || ''
  const totalLabel = resolver.resolve(asResolvableFormText(raw.totalLabel)) || ''
  const getSelected = raw.getSelectedChargeItems
  if (typeof getSelected !== 'function') {
    return {
      paymentChargeHeading: heading,
      paymentChargeLines: [],
      paymentChargeTotalLabel: totalLabel,
      paymentChargeTotalAmount: formatIsk(0),
    }
  }

  const selectedChargeList = getSelected(application) as SelectedChargeListItem[]

  const allChargeWithInfoList =
    getValueViaPath<PaymentCatalogRow[]>(application.externalData, 'payment.data') ??
    []

  const merged = selectedChargeList.map((charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (c) => c.chargeItemCode === charge.chargeItemCode,
    )
    const quantity = charge.chargeItemQuantity ?? 1
    const unit = chargeWithInfo?.priceAmount ?? 0
    const extra =
      charge.extraLabel !== undefined
        ? resolver.resolve(asResolvableFormText(charge.extraLabel))
        : ''
    const name = chargeWithInfo?.chargeItemName ?? charge.chargeItemCode
    const description = extra ? `${name} - ${extra}` : name
    return {
      description,
      quantity: String(quantity),
      amount: formatIsk(unit * quantity),
    }
  })

  const totalPrice = selectedChargeList.reduce((sum, charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (c) => c.chargeItemCode === charge.chargeItemCode,
    )
    const q = charge.chargeItemQuantity ?? 1
    const unit = chargeWithInfo?.priceAmount ?? 0
    return sum + unit * q
  }, 0)

  return {
    paymentChargeHeading: heading,
    paymentChargeLines: merged,
    paymentChargeTotalLabel: totalLabel,
    paymentChargeTotalAmount: formatIsk(totalPrice),
  }
}

/**
 * Field props may be values or template callbacks with application-specific
 * signatures; `unknown[]` is too narrow for those callbacks.
 */
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

const formatDateFieldBoundary = (
  value: Date | string | undefined,
): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value)
}

const mapFieldToComponent = (
  field: FieldDef,
  resolver: FormTextResolver,
  application: Application,
): ComponentDto => {
  const raw = field as FieldDef & Record<string, unknown>

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
  } else if (raw.description && raw.type !== FieldTypes.CHECKBOX) {
    // CHECKBOX uses `description` as a FieldDescription below the title, not as
    // a placeholder. All other fields keep the legacy placeholder fallback.
    component.placeholder = resolver.resolve(raw.description)
  }

  if (raw.options) {
    const opts = resolveFieldProp(raw.options, application)
    component.options = opts
  }

  if (raw.type === FieldTypes.SELECT) {
    const apis = raw.inlineRefetchTemplateApis as string[] | undefined
    if (Array.isArray(apis) && apis.length > 0) {
      component.onSelectRefetchTemplateApis = apis
    }
  }

  if (raw.type === FieldTypes.CHECKBOX) {
    if (raw.strong === true) component.strong = true
    if (raw.large === true) component.large = true
    if (raw.spacing === 0 || raw.spacing === 1 || raw.spacing === 2) {
      component.spacing = raw.spacing
    }
    const bg = raw.backgroundColor as unknown
    if (bg === 'blue' || bg === 'white') {
      component.checkboxBackgroundColor = bg
    }
    if (raw.description) {
      component.description = resolver.resolve(
        asResolvableFormText(raw.description),
      )
    }
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

    case FieldTypes.KEY_VALUE: {
      const resolved = resolveFieldProp(raw.value, application)
      component.value = resolver.resolve(
        resolved == null ? undefined : (resolved as ResolvableFormText),
      )
      break
    }

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
        name: resolver.resolve(asResolvableFormText(a.name)) || String(a.name ?? ''),
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
        ? header.map((h: unknown) => resolver.resolve(asResolvableFormText(h)))
        : []
      component.rows = Array.isArray(rows)
        ? rows.map((row: unknown) =>
            Array.isArray(row)
              ? row.map((c: unknown) =>
                  resolver.resolve(asResolvableFormText(c)),
                )
              : [],
          )
        : []
      break
    }

    case FieldTypes.ACCORDION: {
      const accordionItems = resolveFieldProp(
        raw.accordionItems,
        application,
      ) as
        | Array<{ itemTitle: unknown; itemContent?: unknown }>
        | undefined
      component.items = (accordionItems ?? []).map((item) => ({
        label: resolver.resolve(asResolvableFormText(item.itemTitle)) || '',
        content: resolver.resolve(asResolvableFormText(item.itemContent)) || '',
      }))
      break
    }

    case FieldTypes.DATE: {
      const min = resolveFieldProp(raw.minDate, application)
      const max = resolveFieldProp(raw.maxDate, application)
      component.minDate = formatDateFieldBoundary(
        min as Date | string | undefined,
      )
      component.maxDate = formatDateFieldBoundary(
        max as Date | string | undefined,
      )
      break
    }

    case FieldTypes.TEXT: {
      component.maxLength = raw.maxLength
      if (raw.variant != null) {
        component.inputVariant = raw.variant as string
      }
      if (raw.rows != null) {
        component.textareaRows = raw.rows as number
      }

      const resolvedBg = resolveFieldProp(
        raw.backgroundColor,
        application,
      ) as string | undefined
      component.inputBackgroundColor =
        resolvedBg === 'white' || resolvedBg === 'blue' ? resolvedBg : 'blue'

      const readOnlyVal = resolveFieldProp(raw.readOnly, application)
      component.readOnly = readOnlyVal === true

      const rightAlignVal = resolveFieldProp(raw.rightAlign, application)
      component.rightAlign = rightAlignVal === true

      component.showMaxLength = raw.showMaxLength === true

      const thousandSepVal = resolveFieldProp(
        raw.thousandSeparator,
        application,
      )
      component.thousandSeparator =
        thousandSepVal === true || raw.thousandSeparator === true

      if (raw.allowNegative === false) {
        component.allowNegative = false
      }

      if (typeof raw.format === 'string') {
        component.textFormat = raw.format
      }
      if (raw.suffix) {
        component.textSuffix = resolver.resolve(
          asResolvableFormText(raw.suffix),
        )
      }

      const numMin = resolveFieldProp(raw.min, application) as number | undefined
      const numMax = resolveFieldProp(raw.max, application) as number | undefined
      if (numMin !== undefined) {
        component.textNumberMin = numMin
      }
      if (numMax !== undefined) {
        component.textNumberMax = numMax
      }
      if (raw.step != null) {
        component.textStep =
          typeof raw.step === 'string' ? raw.step : String(raw.step)
      }
      break
    }

    case FieldTypes.FILEUPLOAD:
      component.maxSize = raw.maxSize
      component.accept = raw.uploadAccept
      break

    case FieldTypes.IMAGE:
      component.imageUrl =
        typeof raw.image === 'string' ? raw.image : undefined
      break

    case FieldTypes.DISPLAY: {
      component.value = resolver.resolve(
        resolveFieldProp(raw.value, application?.answers, application?.externalData),
      )
      if (typeof raw.variant === 'string' && raw.variant.length > 0) {
        component.inputVariant = raw.variant
      }
      if (raw.rightAlign === true) {
        component.rightAlign = true
      }
      if (raw.suffix) {
        component.textSuffix = resolver.resolve(
          asResolvableFormText(raw.suffix),
        )
      }
      if (typeof raw.titleVariant === 'string' && raw.titleVariant.length > 0) {
        component.titleVariant = raw.titleVariant
      }
      if (raw.halfWidthOwnline === true) {
        component.halfWidthOwnline = true
      }
      if (raw.label !== undefined) {
        component.displayInputLabel = resolver.resolve(
          asResolvableFormText(raw.label),
        )
      }
      break
    }

    case FieldTypes.INFORMATION_CARD: {
      const items = resolveFieldProp(raw.items, application, raw) as
        | Array<{ label: unknown; value: unknown }>
        | undefined
      component.informationCardItems = (items ?? []).map((item) => ({
        label: resolver.resolve(asResolvableFormText(item.label)) || '',
        value: resolver.resolve(asResolvableFormText(item.value)) || '',
      }))
      break
    }

    case FieldTypes.PAYMENT_CHARGE_OVERVIEW: {
      Object.assign(
        component,
        buildPaymentChargeOverviewFields(
          raw as PaymentChargeOverviewRaw,
          application,
          resolver,
        ),
      )
      break
    }

    case FieldTypes.PDF_LINK_BUTTON:
      component.pdfDescription = resolver.resolve(
        asResolvableFormText(raw.verificationDescription),
      )
      component.pdfLinkTitle = resolver.resolve(
        asResolvableFormText(raw.verificationLinkTitle),
      )
      component.pdfLinkUrl = resolver.resolve(
        asResolvableFormText(raw.verificationLinkUrl),
      )
      break

    case FieldTypes.COPY_LINK:
      if (raw.title) {
        component.copyLinkTitle = resolver.resolve(
          asResolvableFormText(raw.title),
        )
      }
      component.copyLinkText = resolver.resolve(asResolvableFormText(raw.link))
      if (raw.buttonTitle) {
        component.copyButtonTitle = resolver.resolve(
          asResolvableFormText(raw.buttonTitle),
        )
      }
      break
  }

  return component
}

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
