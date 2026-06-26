import { coreMessages } from '@island.is/application/core'
import type {
  CheckboxField,
  FieldsRepeaterField,
  FormText,
  RadioField,
  RepeaterItem,
  StaticText,
  TableRepeaterField,
} from '@island.is/application/types'
import { FieldTypes } from '@island.is/application/types'
import type {
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  ScreenIntrospection,
} from '@island.is/application/types'
import {
  enrichNationalIdWithNameRepeaterItemDescriptors,
} from './field-introspection.util'
import {
  extractMessageDescriptorsFromFormText,
  extractStaticText,
} from './message-descriptor.util'
import {
  extractCheckboxPreviewOptions,
  extractRadioPreviewOptions,
  extractStaticId,
} from './preview-stub.util'

export const mapRepeaterItemToFieldType = (item: RepeaterItem): string => {
  switch (item.component) {
    case 'input': {
      const t = 'type' in item ? item.type : undefined
      if (t === 'email') {
        return FieldTypes.EMAIL
      }
      if (t === 'tel') {
        return FieldTypes.PHONE
      }
      return FieldTypes.TEXT
    }
    case 'phone':
      return FieldTypes.PHONE
    case 'nationalIdWithName':
      return FieldTypes.NATIONAL_ID_WITH_NAME
    case 'date':
      return FieldTypes.DATE
    case 'select':
      return FieldTypes.SELECT
    case 'selectAsync':
      return FieldTypes.ASYNC_SELECT
    case 'radio':
      return FieldTypes.RADIO
    case 'checkbox':
      return FieldTypes.CHECKBOX
    case 'fileUpload':
      return FieldTypes.FILEUPLOAD
    case 'description':
      return FieldTypes.DESCRIPTION
    case 'alertMessage':
      return FieldTypes.ALERT_MESSAGE
    case 'vehiclePermnoWithInfo':
      return FieldTypes.VEHICLE_PERMNO_WITH_INFO
    case 'hiddenInput':
      return FieldTypes.HIDDEN_INPUT
    default:
      return FieldTypes.TEXT
  }
}

export const buildTableRepeaterColumnHeaderDescriptors = (
  tr: TableRepeaterField,
): MessageDescriptorInfo[] => {
  const fields = tr.fields ?? {}
  const items: Array<RepeaterItem & { id: string }> = Object.keys(fields).map(
    (id) => ({ id, ...fields[id] } as RepeaterItem & { id: string }),
  )
  const tableItems = items.filter((x) => x.displayInTable !== false)

  const tableHeader = tr.table?.header
  if (Array.isArray(tableHeader) && tableHeader.length > 0) {
    const out: MessageDescriptorInfo[] = []
    for (const h of tableHeader) {
      out.push(...extractMessageDescriptorsFromFormText(h as FormText))
    }
    return out
  }

  const out: MessageDescriptorInfo[] = []
  for (const item of tableItems) {
    if (item.component === 'nationalIdWithName') {
      out.push(
        ...extractMessageDescriptorsFromFormText(coreMessages.name as FormText),
        ...extractMessageDescriptorsFromFormText(
          coreMessages.nationalId as FormText,
        ),
      )
    } else if (item.component === 'description' && 'title' in item) {
      const t = (item as { title: StaticText }).title
      const st =
        typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
      out.push(...extractMessageDescriptorsFromFormText(st as FormText))
    } else if (item.component === 'fileUpload' && 'title' in item) {
      const t = (item as { title?: StaticText }).title
      if (t) {
        const st =
          typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
        out.push(...extractMessageDescriptorsFromFormText(st as FormText))
      }
    } else {
      const lab = item.label
      if (!lab) {
        continue
      }
      const st =
        typeof lab === 'function' ? (lab as (i: number) => StaticText)(0) : lab
      out.push(...extractMessageDescriptorsFromFormText(st as FormText))
    }
  }
  return out
}

export const walkRepeaterItemToScreen = (
  repeaterId: string,
  itemKey: string,
  item: RepeaterItem,
): ScreenIntrospection => {
  const id = `${repeaterId}::repeaterItem::${itemKey}`
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  if (item.component === 'description' && 'title' in item) {
    const t = (item as { title: StaticText }).title
    const st = typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    pushText(st)
  } else if (item.component === 'fileUpload') {
    const fu = item as RepeaterItem & { component: 'fileUpload' }
    pushText(fu.title)
    pushText(fu.introduction)
    pushText(fu.uploadHeader)
    pushText(fu.uploadDescription)
    pushText(fu.uploadButtonLabel)
    pushText(fu.maxSizeErrorText)
  } else if (item.component === 'alertMessage') {
    const am = item as RepeaterItem & { component: 'alertMessage' }
    if (am.title && typeof am.title !== 'function') {
      pushText(am.title as StaticText)
    }
    if (am.message && typeof am.message !== 'function') {
      pushText(am.message as StaticText)
    }
  } else if (item.component === 'vehiclePermnoWithInfo') {
    const v = item as RepeaterItem & { component: 'vehiclePermnoWithInfo' }
    pushText(v.permnoLabel)
    pushText(v.makeAndColorLabel)
    pushText(v.errorTitle)
    pushText(v.fallbackErrorMessage)
    pushText(v.validationFailedErrorMessage)
  } else if (item.component === 'selectAsync') {
    const sa = item as RepeaterItem & { component: 'selectAsync' }
    pushText(sa.loadingError)
  } else if ('label' in item && item.label) {
    const lab = item.label
    const st =
      typeof lab === 'function' ? (lab as (i: number) => StaticText)(0) : lab
    descriptors.push(...extractMessageDescriptorsFromFormText(st as FormText))
  }
  if (item.component === 'phone' && item.phoneLabel) {
    pushText(item.phoneLabel as FormText)
  }
  if (item.component === 'nationalIdWithName') {
    if (item.customNameLabel) {
      pushText(item.customNameLabel as FormText)
    }
    if (item.customNationalIdLabel) {
      pushText(item.customNationalIdLabel as FormText)
    }
  }
  if ('placeholder' in item && item.placeholder) {
    pushText(item.placeholder)
  }
  if (
    (item.component === 'radio' ||
      item.component === 'select' ||
      item.component === 'checkbox') &&
    Array.isArray(item.options)
  ) {
    for (const opt of item.options) {
      if (opt && typeof opt === 'object' && 'label' in opt) {
        pushText((opt as { label: FormText }).label)
        if ('tooltip' in opt && (opt as { tooltip?: FormText }).tooltip) {
          pushText((opt as { tooltip: FormText }).tooltip)
        }
      }
    }
  }

  const labelStatic: StaticText | undefined = (() => {
    if (item.component === 'description' && 'title' in item) {
      const t = (item as { title: StaticText }).title
      return typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    }
    if (item.component === 'fileUpload' && 'title' in item) {
      const t = (item as { title?: StaticText }).title
      if (!t) return undefined
      return typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
    }
    if (!('label' in item) || !item.label) {
      return undefined
    }
    const lab = item.label
    return typeof lab === 'function'
      ? (lab as (i: number) => StaticText)(0)
      : lab
  })()

  const title = extractStaticText(labelStatic)
  const widthStr =
    item.width === 'half' || item.width === 'full' || item.width === 'third'
      ? item.width
      : null

  const finalDescriptors =
    item.component === 'nationalIdWithName'
      ? enrichNationalIdWithNameRepeaterItemDescriptors(item, descriptors)
      : descriptors

  let radioOptions: RadioOptionIntrospection[] | undefined
  let radioLargeButtons: boolean | null | undefined
  let radioBackgroundColor: string | null | undefined
  let checkboxOptions: RadioOptionIntrospection[] | undefined
  let checkboxLarge: boolean | null | undefined
  let checkboxStrong: boolean | null | undefined
  let checkboxBackgroundColor: string | null | undefined
  let checkboxSpacing: number | null | undefined

  if (item.component === 'radio' && item.options) {
    const pseudo = {
      id,
      type: FieldTypes.RADIO,
      options: item.options,
    } as RadioField
    radioOptions = extractRadioPreviewOptions(pseudo)
    if (
      typeof (item as { largeButtons?: boolean }).largeButtons === 'boolean'
    ) {
      radioLargeButtons = (item as { largeButtons?: boolean }).largeButtons
    }
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      radioBackgroundColor = item.backgroundColor
    }
  }
  if (item.component === 'checkbox' && item.options) {
    const pseudo = {
      id,
      type: FieldTypes.CHECKBOX,
      options: item.options,
    } as CheckboxField
    checkboxOptions = extractCheckboxPreviewOptions(pseudo)
    const cb = item as { large?: boolean; strong?: boolean }
    checkboxLarge = typeof cb.large === 'boolean' ? cb.large : true
    checkboxStrong = typeof cb.strong === 'boolean' ? cb.strong : false
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      checkboxBackgroundColor = item.backgroundColor
    } else {
      checkboxBackgroundColor = 'blue'
    }
  }

  let inputBackgroundColor: string | null | undefined
  if (
    item.component !== 'radio' &&
    item.component !== 'checkbox' &&
    (item.component === 'input' ||
      item.component === 'phone' ||
      item.component === 'date' ||
      item.component === 'select' ||
      item.component === 'selectAsync' ||
      item.component === 'nationalIdWithName')
  ) {
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      inputBackgroundColor = item.backgroundColor
    }
  }

  const titleVariantStr =
    item.component === 'description' && 'titleVariant' in item
      ? String((item as { titleVariant?: string }).titleVariant ?? '')
      : null

  const base: ScreenIntrospection = {
    id,
    type: mapRepeaterItemToFieldType(item),
    title: title && title.length > 0 ? title : null,
    description: null,
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: widthStr,
    space: null,
    marginTop: null,
    marginBottom: null,
    paddingTop: null,
    titleVariant:
      titleVariantStr && titleVariantStr.length > 0 ? titleVariantStr : null,
    messageDescriptors: finalDescriptors,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor: radioBackgroundColor ?? null,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
    inputBackgroundColor: inputBackgroundColor ?? null,
  }

  if (item.component === 'nationalIdWithName') {
    return {
      ...base,
      type: FieldTypes.NATIONAL_ID_WITH_NAME,
      nationalIdWithNameCustomNationalIdLabelText: extractStaticText(
        item.customNationalIdLabel as StaticText | undefined,
      ),
      nationalIdWithNameCustomNameLabelText: extractStaticText(
        item.customNameLabel as StaticText | undefined,
      ),
      nationalIdWithNameShowPhoneField: item.showPhoneField ?? null,
      nationalIdWithNameShowEmailField: item.showEmailField ?? null,
      nationalIdWithNamePhoneLabelText: extractStaticText(
        item.phoneLabel as StaticText | undefined,
      ),
      nationalIdWithNameEmailLabelText: extractStaticText(
        item.emailLabel as StaticText | undefined,
      ),
    }
  }

  return base
}

export const walkTableRepeaterScreen = (
  tr: TableRepeaterField,
): ScreenIntrospection => {
  const trRecord = tr as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  pushText(tr.title)
  pushText(trRecord.description)
  pushText(tr.formTitle)
  pushText(tr.addItemButtonText)
  pushText(tr.cancelButtonText)
  pushText(tr.saveItemButtonText)
  pushText(tr.removeButtonTooltipText)
  pushText(tr.editButtonTooltipText)
  pushText(tr.loadErrorMessage)

  const columnHeaders = buildTableRepeaterColumnHeaderDescriptors(tr)
  for (const d of columnHeaders) {
    if (!descriptors.some((x) => x.id === d.id)) {
      descriptors.push(d)
    }
  }

  const formScreens: ScreenIntrospection[] = []
  for (const [key, item] of Object.entries(tr.fields ?? {})) {
    const s = walkRepeaterItemToScreen(extractStaticId(tr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: extractStaticId(tr.id),
    type: FieldTypes.TABLE_REPEATER,
    title: extractStaticText(tr.title as StaticText | undefined),
    description: extractStaticText(
      trRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: tr.marginTop ?? null,
    marginBottom: tr.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: formScreens.length > 0 ? formScreens : undefined,
    tableRepeaterColumnHeaders: columnHeaders,
    tableRepeaterFormTitle: extractStaticText(
      tr.formTitle as StaticText | undefined,
    ),
    tableRepeaterAddItemButtonText: extractStaticText(
      tr.addItemButtonText as StaticText | undefined,
    ),
    tableRepeaterCancelButtonText: extractStaticText(
      tr.cancelButtonText as StaticText | undefined,
    ),
    tableRepeaterSaveItemButtonText: extractStaticText(
      tr.saveItemButtonText as StaticText | undefined,
    ),
  }
}

export const walkFieldsRepeaterScreen = (
  fr: FieldsRepeaterField,
): ScreenIntrospection => {
  const frRecord = fr as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  pushText(fr.title)
  pushText(frRecord.description)
  if (fr.formTitle && typeof fr.formTitle !== 'function') {
    pushText(fr.formTitle)
  }
  pushText(fr.addItemButtonText)
  pushText(fr.removeItemButtonText)
  if (fr.saveItemButtonText) {
    pushText(fr.saveItemButtonText)
  }

  const formScreens: ScreenIntrospection[] = []
  for (const [key, item] of Object.entries(fr.fields ?? {})) {
    const s = walkRepeaterItemToScreen(extractStaticId(fr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: extractStaticId(fr.id),
    type: FieldTypes.FIELDS_REPEATER,
    title: extractStaticText(fr.title as StaticText | undefined),
    description: extractStaticText(
      frRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: fr.marginTop ?? null,
    marginBottom: fr.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: formScreens.length > 0 ? formScreens : undefined,
    fieldsRepeaterFormTitle:
      fr.formTitle && typeof fr.formTitle !== 'function'
        ? extractStaticText(fr.formTitle as StaticText)
        : null,
    fieldsRepeaterAddItemButtonText: extractStaticText(
      fr.addItemButtonText as StaticText | undefined,
    ),
    fieldsRepeaterRemoveItemButtonText: extractStaticText(
      fr.removeItemButtonText as StaticText | undefined,
    ),
  }
}
