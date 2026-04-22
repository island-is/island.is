import { Injectable } from '@nestjs/common'
import { coreErrorMessages, coreMessages } from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationConfigurations,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'
import type {
  Form,
  FormNode,
  FormLeaf,
  Section,
  SubSection,
  MultiField,
  Field,
  RadioField,
  RepeaterItem,
  StaticText,
  FormText,
  FormTextWithLocale,
  DataProviderItem,
  TableRepeaterField,
  FieldsRepeaterField,
  NationalIdWithNameField,
  CheckboxField,
  StaticTableField,
} from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import type { MessageDescriptor } from 'react-intl'

export interface TemplateIntrospection {
  typeId: string
  name: string
  slug: string
  translationNamespaces: string[]
  states: StateIntrospection[]
  allMessageDescriptors: MessageDescriptorInfo[]
}

export interface StateIntrospection {
  stateKey: string
  stateName: string
  status: string
  roles: RoleIntrospection[]
}

export interface RoleIntrospection {
  roleId: string
  form: FormIntrospection | null
}

export interface FormIntrospection {
  id: string
  title: string | null
  sections: SectionIntrospection[]
}

export interface SectionIntrospection {
  id: string
  title: string | null
  subSections: SubSectionIntrospection[]
  screens: ScreenIntrospection[]
}

export interface SubSectionIntrospection {
  id: string
  title: string | null
  screens: ScreenIntrospection[]
}

export interface ScreenIntrospection {
  id: string
  type: string
  title: string | null
  description: string | null
  /** `EXTERNAL_DATA_SOURCE` (data provider row): optional heading above the blue title. */
  pageTitle: string | null
  /** `EXTERNAL_DATA_PROVIDER`: intro line next to the icon (matches `subTitle`). */
  subTitle: string | null
  /** `EXTERNAL_DATA_PROVIDER`: optional copy after the checkbox (matches `subDescription`). */
  subDescription: string | null
  /** `EXTERNAL_DATA_PROVIDER`: consent label (matches `checkboxLabel`). */
  checkboxLabel: string | null
  width: string | null
  /** `MULTI_FIELD` only: vertical gap between child fields (matches `FormMultiField`). */
  space: number | null
  marginTop?: unknown
  marginBottom?: unknown
  /** Maps `field.space` (e.g. description/radio top padding) to `Box` `paddingTop`. */
  paddingTop?: unknown
  /** Fields with `titleVariant` in the template (e.g. DESCRIPTION). */
  titleVariant?: string | null
  messageDescriptors: MessageDescriptorInfo[]
  children?: ScreenIntrospection[]
  /** `RADIO` fields: options for preview parity with `RadioController`. */
  radioOptions?: RadioOptionIntrospection[]
  radioLargeButtons?: boolean | null
  radioBackgroundColor?: string | null
  /** `CHECKBOX` fields: same shape as `radioOptions` (option labels for preview). */
  checkboxOptions?: RadioOptionIntrospection[]
  /** Defaults to `true` in `buildCheckboxField` when omitted. */
  checkboxLarge?: boolean | null
  checkboxStrong?: boolean | null
  /** `'blue'` is the default in `buildCheckboxField`. */
  checkboxBackgroundColor?: string | null
  /** 0 | 1 | 2, matches `CheckboxField.spacing` / `CheckboxController` default 2. */
  checkboxSpacing?: number | null
  /** `TABLE_REPEATER`: one descriptor per table column (visual order, left to right). */
  tableRepeaterColumnHeaders?: MessageDescriptorInfo[]
  /** `TABLE_REPEATER`: `extractStaticText` of optional mini-form title (resolve via descriptors). */
  tableRepeaterFormTitle?: string | null
  tableRepeaterAddItemButtonText?: string | null
  tableRepeaterCancelButtonText?: string | null
  tableRepeaterSaveItemButtonText?: string | null
  /** `FIELDS_REPEATER`: `extractStaticText` of form title (when not a function). */
  fieldsRepeaterFormTitle?: string | null
  fieldsRepeaterAddItemButtonText?: string | null
  fieldsRepeaterRemoveItemButtonText?: string | null
  /** `NATIONAL_ID_WITH_NAME`: `extractStaticText` of `custom*Label` for preview / `resolveTranslatableStaticText`. */
  nationalIdWithNameCustomNationalIdLabelText?: string | null
  nationalIdWithNameCustomNameLabelText?: string | null
  nationalIdWithNameShowPhoneField?: boolean | null
  nationalIdWithNameShowEmailField?: boolean | null
  nationalIdWithNamePhoneLabelText?: string | null
  nationalIdWithNameEmailLabelText?: string | null
  /** `STATIC_TABLE`: one descriptor per column header (when header is a static array). */
  staticTableHeaderDescriptors?: MessageDescriptorInfo[]
  /** `STATIC_TABLE`: row-major list of one descriptor per cell (when `rows` is a static 2D array). */
  staticTableRowCellDescriptors?: MessageDescriptorInfo[]
  staticTableColumnCount?: number | null
  staticTableRowCount?: number | null
  /** `true` when `header` is a function and cannot be evaluated at build time. */
  staticTableHeaderFromFunction?: boolean | null
  /** `true` when `rows` is a function (data comes from the application at runtime). */
  staticTableRowsFromFunction?: boolean | null
  staticTableTitleVariant?: string | null
  staticTableSummary?: Array<{
    label: MessageDescriptorInfo
    value: MessageDescriptorInfo
  }>
}

export interface MessageDescriptorInfo {
  id: string
  defaultMessage?: string
  description?: string
}

/** Radio option labels for admin translation preview (static or message-backed). */
export interface RadioOptionIntrospection {
  value: string
  labelMessageId?: string | null
  labelDefaultMessage?: string | null
}

function extractStaticText(text: StaticText | undefined): string | null {
  if (!text) return null
  if (typeof text === 'string') return text
  if (typeof text === 'object' && 'defaultMessage' in text) {
    return (text.defaultMessage as string) ?? text.id ?? null
  }
  return null
}

function isMessageDescriptor(obj: unknown): obj is MessageDescriptor {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as MessageDescriptor).id === 'string'
  )
}

function extractMessageDescriptorsFromFormText(
  text: FormText | FormTextWithLocale | undefined,
): MessageDescriptorInfo[] {
  if (!text) return []
  if (typeof text === 'function') return []
  if (typeof text === 'string') return []
  if (isMessageDescriptor(text)) {
    return [
      {
        id: String(text.id),
        defaultMessage: text.defaultMessage as string | undefined,
        description: text.description as string | undefined,
      },
    ]
  }
  return []
}

function walkExternalDataSourceItem(
  syntheticId: string,
  provider: DataProviderItem,
): ScreenIntrospection {
  const descriptors: MessageDescriptorInfo[] = []
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.pageTitle as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(provider.title as FormText | undefined),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.subTitle as FormText | undefined,
    ),
  )

  return {
    id: syntheticId,
    type: 'EXTERNAL_DATA_SOURCE',
    title: extractStaticText(provider.title as StaticText | undefined),
    description: extractStaticText(provider.subTitle as StaticText | undefined),
    pageTitle: extractStaticText(provider.pageTitle as StaticText | undefined),
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    marginTop: null,
    marginBottom: null,
    paddingTop: null,
    messageDescriptors: descriptors,
    children: undefined,
  }
}

function extractFieldOptionsForPreview(
  options: RadioField['options'] | CheckboxField['options'],
): RadioOptionIntrospection[] | undefined {
  const raw = options
  if (typeof raw === 'function' || !Array.isArray(raw)) {
    return undefined
  }
  return raw.map((option) => {
    const label = option.label
    if (isMessageDescriptor(label)) {
      return {
        value: option.value,
        labelMessageId: String(label.id),
        labelDefaultMessage: (label.defaultMessage as string | undefined) ?? null,
      }
    }
    if (typeof label === 'function') {
      return {
        value: option.value,
        labelDefaultMessage: option.value,
      }
    }
    if (typeof label === 'string') {
      return { value: option.value, labelDefaultMessage: label }
    }
    return {
      value: option.value,
      labelDefaultMessage: extractStaticText(label as StaticText),
    }
  })
}

function extractRadioPreviewOptions(
  field: RadioField,
): RadioOptionIntrospection[] | undefined {
  return extractFieldOptionsForPreview(field.options)
}

function extractCheckboxPreviewOptions(
  field: CheckboxField,
): RadioOptionIntrospection[] | undefined {
  return extractFieldOptionsForPreview(field.options)
}

function extractMessageDescriptorsFromField(
  field: Field,
): MessageDescriptorInfo[] {
  const descriptors: MessageDescriptorInfo[] = []
  const f = field as unknown as Record<string, unknown>

  descriptors.push(...extractMessageDescriptorsFromFormText(field.title))
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.description as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.placeholder as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.tooltip as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.message as FormText | FormTextWithLocale | undefined,
    ),
  )

  const links = f.links
  if (Array.isArray(links)) {
    for (const link of links) {
      if (link && typeof link === 'object') {
        const linkRecord = link as Record<string, unknown>
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(
            linkRecord.title as FormText | undefined,
          ),
        )
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(
            linkRecord.url as FormText | undefined,
          ),
        )
      }
    }
  }

  const options = f.options
  if (Array.isArray(options)) {
    for (const option of options) {
      if (option && typeof option === 'object') {
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(option.label),
        )
        descriptors.push(
          ...extractMessageDescriptorsFromFormText(option.tooltip),
        )
      }
    }
  }

  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.customNationalIdLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.customNameLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.phoneLabel as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      f.emailLabel as FormText | undefined,
    ),
  )

  return descriptors
}

function mergeMessageDescriptors(
  base: MessageDescriptorInfo[],
  extra: MessageDescriptorInfo[],
): MessageDescriptorInfo[] {
  const out = [...base]
  for (const x of extra) {
    if (!out.some((z) => z.id === x.id)) {
      out.push(x)
    }
  }
  return out
}

function enrichNationalIdWithNameFieldDescriptors(
  nif: {
    customNationalIdLabel?: StaticText
    customNameLabel?: StaticText
    showPhoneField?: boolean
    showEmailField?: boolean
    phoneLabel?: StaticText
    emailLabel?: StaticText
  },
  descriptors: MessageDescriptorInfo[],
): MessageDescriptorInfo[] {
  let out = [...descriptors]
  if (!nif.customNationalIdLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryNationalId as FormText,
      ),
    )
  }
  if (!nif.customNameLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryName as FormText,
      ),
    )
  }
  if (nif.showPhoneField && !nif.phoneLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryPhone as FormText,
      ),
    )
  }
  if (nif.showEmailField && !nif.emailLabel) {
    out = mergeMessageDescriptors(
      out,
      extractMessageDescriptorsFromFormText(
        coreErrorMessages.nationalRegistryEmail as FormText,
      ),
    )
  }
  return out
}

function enrichNationalIdWithNameRepeaterItemDescriptors(
  item: RepeaterItem,
  descriptors: MessageDescriptorInfo[],
): MessageDescriptorInfo[] {
  if (item.component !== 'nationalIdWithName') {
    return descriptors
  }
  return enrichNationalIdWithNameFieldDescriptors(item, descriptors)
}

function mapRepeaterItemToFieldType(item: RepeaterItem): string {
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

function buildTableRepeaterColumnHeaderDescriptors(
  tr: TableRepeaterField,
): MessageDescriptorInfo[] {
  const fields = tr.fields ?? {}
  const items: Array<RepeaterItem & { id: string }> = Object.keys(fields).map(
    (id) => ({ id, ...fields[id] }) as RepeaterItem & { id: string },
  )
  const tableItems = items.filter((x) => x.displayInTable !== false)

  if (tr.table?.header && tr.table.header.length > 0) {
    const out: MessageDescriptorInfo[] = []
    for (const h of tr.table.header) {
      out.push(...extractMessageDescriptorsFromFormText(h as FormText))
    }
    return out
  }

  const out: MessageDescriptorInfo[] = []
  for (const item of tableItems) {
    if (item.component === 'nationalIdWithName') {
      out.push(
        ...extractMessageDescriptorsFromFormText(
          coreMessages.name as FormText,
        ),
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

function walkRepeaterItemToScreen(
  repeaterId: string,
  itemKey: string,
  item: RepeaterItem,
): ScreenIntrospection {
  const id = `${repeaterId}::repeaterItem::${itemKey}`
  const descriptors: MessageDescriptorInfo[] = []
  const pushText = (t: unknown) => {
    if (t) {
      descriptors.push(...extractMessageDescriptorsFromFormText(t as FormText))
    }
  }

  if (item.component === 'description' && 'title' in item) {
    const t = (item as { title: StaticText }).title
    const st =
      typeof t === 'function' ? (t as (i: number) => StaticText)(0) : t
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
      return typeof t === 'function'
        ? (t as (i: number) => StaticText)(0)
        : t
    }
    if (item.component === 'fileUpload' && 'title' in item) {
      const t = (item as { title?: StaticText }).title
      if (!t) return undefined
      return typeof t === 'function'
        ? (t as (i: number) => StaticText)(0)
        : t
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

  if (item.component === 'radio' && Array.isArray(item.options)) {
    const pseudo = { options: item.options } as unknown as RadioField
    radioOptions = extractRadioPreviewOptions(pseudo)
    if (typeof (item as { largeButtons?: boolean }).largeButtons === 'boolean') {
      radioLargeButtons = (item as { largeButtons?: boolean }).largeButtons
    }
    if (item.backgroundColor === 'white' || item.backgroundColor === 'blue') {
      radioBackgroundColor = item.backgroundColor
    }
  }
  if (item.component === 'checkbox' && Array.isArray(item.options)) {
    const pseudo = { options: item.options } as unknown as CheckboxField
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
    titleVariant: titleVariantStr && titleVariantStr.length > 0 ? titleVariantStr : null,
    messageDescriptors: finalDescriptors,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor: radioBackgroundColor ?? null,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
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

function walkTableRepeaterScreen(tr: TableRepeaterField): ScreenIntrospection {
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
    const s = walkRepeaterItemToScreen(String(tr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: tr.id,
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

function walkFieldsRepeaterScreen(fr: FieldsRepeaterField): ScreenIntrospection {
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
    const s = walkRepeaterItemToScreen(String(fr.id), key, item)
    formScreens.push(s)
    for (const d of s.messageDescriptors) {
      if (!descriptors.some((x) => x.id === d.id)) {
        descriptors.push(d)
      }
    }
  }

  return {
    id: fr.id,
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

function addDescriptorIfNew(
  target: MessageDescriptorInfo[],
  d: MessageDescriptorInfo,
) {
  if (!target.some((x) => x.id === d.id)) {
    target.push(d)
  }
}

function walkStaticTableScreen(st: StaticTableField): ScreenIntrospection {
  const stRecord = st as unknown as Record<string, unknown>
  const descriptors: MessageDescriptorInfo[] = []
  const mergeIn = (arr: MessageDescriptorInfo[]) => {
    for (const d of arr) {
      addDescriptorIfNew(descriptors, d)
    }
  }
  const mergeText = (t: unknown) => {
    if (t) {
      mergeIn(extractMessageDescriptorsFromFormText(t as FormText))
    }
  }
  mergeText(st.title)
  mergeText(stRecord.description)

  const headerFromFunction = typeof st.header === 'function'
  const headerDescriptors: MessageDescriptorInfo[] = []
  if (!headerFromFunction && Array.isArray(st.header)) {
    for (const h of st.header) {
      const part = extractMessageDescriptorsFromFormText(h as FormText)
      if (part[0]) {
        headerDescriptors.push(part[0])
        addDescriptorIfNew(descriptors, part[0])
      }
    }
  }

  const rowsFromFunction = typeof st.rows === 'function'
  const rowCellFlat: MessageDescriptorInfo[] = []
  let rowCount = 0
  let colCount = headerDescriptors.length

  if (!rowsFromFunction && Array.isArray(st.rows)) {
    rowCount = st.rows.length
    for (const row of st.rows) {
      colCount = Math.max(colCount, row.length)
      for (const cell of row) {
        const part = extractMessageDescriptorsFromFormText(cell as FormText)
        if (part[0]) {
          rowCellFlat.push(part[0])
          addDescriptorIfNew(descriptors, part[0])
        }
      }
    }
  }

  if (headerDescriptors.length > 0) {
    colCount = Math.max(colCount, headerDescriptors.length)
  } else if (!headerFromFunction && colCount === 0 && rowCount > 0 && st.rows) {
    const r0 = (st.rows as StaticText[][])[0]
    if (r0) {
      colCount = r0.length
    }
  }

  const summaryRows: Array<{
    label: MessageDescriptorInfo
    value: MessageDescriptorInfo
  }> = []
  if (st.summary && typeof st.summary !== 'function') {
    for (const s of st.summary) {
      const ld = extractMessageDescriptorsFromFormText(s.label as FormText)
      const vd = extractMessageDescriptorsFromFormText(s.value as FormText)
      if (ld[0] && vd[0]) {
        summaryRows.push({ label: ld[0], value: vd[0] })
        addDescriptorIfNew(descriptors, ld[0])
        addDescriptorIfNew(descriptors, vd[0])
      }
    }
  }

  return {
    id: st.id && String(st.id).length > 0 ? st.id : 'staticTable',
    type: FieldTypes.STATIC_TABLE,
    title: extractStaticText(st.title as StaticText | undefined),
    description: extractStaticText(
      stRecord.description as StaticText | undefined,
    ),
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: 'full',
    space: null,
    marginTop: st.marginTop ?? null,
    marginBottom: st.marginBottom ?? null,
    paddingTop: null,
    messageDescriptors: descriptors,
    staticTableHeaderDescriptors:
      headerDescriptors.length > 0 ? headerDescriptors : undefined,
    staticTableRowCellDescriptors:
      rowCellFlat.length > 0 ? rowCellFlat : undefined,
    staticTableColumnCount: colCount > 0 ? colCount : null,
    staticTableRowCount: rowCount,
    staticTableHeaderFromFunction: headerFromFunction ? true : null,
    staticTableRowsFromFunction: rowsFromFunction ? true : null,
    staticTableTitleVariant: st.titleVariant ?? 'h4',
    staticTableSummary: summaryRows.length > 0 ? summaryRows : undefined,
  }
}

function walkFormLeaf(leaf: FormLeaf): ScreenIntrospection {
  const descriptors: MessageDescriptorInfo[] = []
  const children: ScreenIntrospection[] = []
  const leafRecord = leaf as unknown as Record<string, unknown>
  const nifMeta: {
    nationalIdWithNameCustomNationalIdLabelText?: string | null
    nationalIdWithNameCustomNameLabelText?: string | null
    nationalIdWithNameShowPhoneField?: boolean | null
    nationalIdWithNameShowEmailField?: boolean | null
    nationalIdWithNamePhoneLabelText?: string | null
    nationalIdWithNameEmailLabelText?: string | null
  } = {}

  let description: string | null = null
  let subTitle: string | null = null
  let subDescription: string | null = null
  let checkboxLabel: string | null = null
  let width: string | null = null
  let space: number | null = null
  let marginTop: unknown = null
  let marginBottom: unknown = null
  let paddingTop: unknown = null
  let titleVariant: string | null = null

  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    descriptors.push(...extractMessageDescriptorsFromFormText(leaf.title))
    const multiField = leaf as MultiField
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(multiField.description),
    )
    description = extractStaticText(
      multiField.description as StaticText | undefined,
    )
    if (typeof leafRecord.space === 'number') {
      space = leafRecord.space as number
    }
    if (multiField.children) {
      for (const child of multiField.children) {
        const childScreen = walkFormLeaf(child)
        children.push(childScreen)
        descriptors.push(...childScreen.messageDescriptors)
      }
    }
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    descriptors.push(...extractMessageDescriptorsFromFormText(leaf.title))
    const edp = leafRecord
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.subTitle as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.description as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.checkboxLabel as FormText | undefined,
      ),
    )
    descriptors.push(
      ...extractMessageDescriptorsFromFormText(
        edp.subDescription as FormText | undefined,
      ),
    )
    description = extractStaticText(edp.description as StaticText | undefined)
    subTitle = extractStaticText(edp.subTitle as StaticText | undefined)
    subDescription = extractStaticText(edp.subDescription as StaticText | undefined)
    checkboxLabel = extractStaticText(edp.checkboxLabel as StaticText | undefined)

    const dataProviders = (edp.dataProviders as DataProviderItem[] | undefined) ?? []
    for (const provider of dataProviders) {
      if (!provider?.id) continue
      const childScreen = walkExternalDataSourceItem(
        `${leaf.id ?? 'external'}::${provider.id}`,
        provider,
      )
      children.push(childScreen)
      descriptors.push(...childScreen.messageDescriptors)
    }

    const otherPermissions =
      (edp.otherPermissions as DataProviderItem[] | undefined) ?? []
    for (const permission of otherPermissions) {
      if (!permission?.id) continue
      const childScreen = walkExternalDataSourceItem(
        `${leaf.id ?? 'external'}::perm::${permission.id}`,
        permission,
      )
      children.push(childScreen)
      descriptors.push(...childScreen.messageDescriptors)
    }
  } else if (leaf.type === FieldTypes.STATIC_TABLE) {
    return walkStaticTableScreen(leaf as StaticTableField)
  } else if (leaf.type === FieldTypes.TABLE_REPEATER) {
    return walkTableRepeaterScreen(leaf as TableRepeaterField)
  } else if (leaf.type === FieldTypes.FIELDS_REPEATER) {
    return walkFieldsRepeaterScreen(leaf as FieldsRepeaterField)
  } else {
    const field = leaf as Field
    let fromField = extractMessageDescriptorsFromField(field)
    if (leaf.type === FieldTypes.NATIONAL_ID_WITH_NAME) {
      const nif = leaf as NationalIdWithNameField
      fromField = enrichNationalIdWithNameFieldDescriptors(nif, fromField)
      nifMeta.nationalIdWithNameCustomNationalIdLabelText = extractStaticText(
        nif.customNationalIdLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameCustomNameLabelText = extractStaticText(
        nif.customNameLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameShowPhoneField = nif.showPhoneField ?? null
      nifMeta.nationalIdWithNameShowEmailField = nif.showEmailField ?? null
      nifMeta.nationalIdWithNamePhoneLabelText = extractStaticText(
        nif.phoneLabel as StaticText | undefined,
      )
      nifMeta.nationalIdWithNameEmailLabelText = extractStaticText(
        nif.emailLabel as StaticText | undefined,
      )
    }
    descriptors.push(...fromField)
    description = extractStaticText(
      leafRecord.description as StaticText | undefined,
    )
    if (typeof field.width === 'string') {
      width = field.width
    }
    marginTop = field.marginTop ?? null
    marginBottom = field.marginBottom ?? null
    if ('space' in field && field.space !== undefined) {
      paddingTop = field.space
    }
    if ('titleVariant' in field && field.titleVariant) {
      titleVariant = String(field.titleVariant)
    }
  }

  let radioOptions: RadioOptionIntrospection[] | undefined
  let radioLargeButtons: boolean | null | undefined
  let radioBackgroundColor: string | null | undefined

  let checkboxOptions: RadioOptionIntrospection[] | undefined
  let checkboxLarge: boolean | null | undefined
  let checkboxStrong: boolean | null | undefined
  let checkboxBackgroundColor: string | null | undefined
  let checkboxSpacing: number | null | undefined

  if (leaf.type === FieldTypes.RADIO) {
    const rf = leaf as RadioField
    radioOptions = extractRadioPreviewOptions(rf)
    if (typeof rf.largeButtons === 'boolean') {
      radioLargeButtons = rf.largeButtons
    }
    if (rf.backgroundColor === 'white' || rf.backgroundColor === 'blue') {
      radioBackgroundColor = rf.backgroundColor
    }
  }

  if (leaf.type === FieldTypes.CHECKBOX) {
    const cf = leaf as CheckboxField
    checkboxOptions = extractCheckboxPreviewOptions(cf)
    checkboxLarge = typeof cf.large === 'boolean' ? cf.large : true
    checkboxStrong = typeof cf.strong === 'boolean' ? cf.strong : false
    if (cf.backgroundColor === 'white' || cf.backgroundColor === 'blue') {
      checkboxBackgroundColor = cf.backgroundColor
    } else {
      checkboxBackgroundColor = 'blue'
    }
    if (typeof cf.spacing === 'number') {
      checkboxSpacing = cf.spacing
    }
  }

  return {
    id: leaf.id ?? '',
    type: leaf.type ?? 'FIELD',
    title: extractStaticText(leaf.title as StaticText | undefined),
    description,
    pageTitle: null,
    subTitle,
    subDescription,
    checkboxLabel,
    width,
    space,
    marginTop,
    marginBottom,
    paddingTop,
    titleVariant,
    messageDescriptors: descriptors,
    children: children.length > 0 ? children : undefined,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
    ...nifMeta,
  }
}

function walkSection(section: Section): SectionIntrospection {
  const subSections: SubSectionIntrospection[] = []
  const screens: ScreenIntrospection[] = []

  for (const child of section.children) {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(walkSubSection(child as SubSection))
    } else {
      screens.push(walkFormLeaf(child as FormLeaf))
    }
  }

  return {
    id: section.id ?? '',
    title: extractStaticText(section.title as StaticText | undefined),
    subSections,
    screens,
  }
}

function walkSubSection(subSection: SubSection): SubSectionIntrospection {
  const screens: ScreenIntrospection[] = []

  for (const child of subSection.children) {
    screens.push(walkFormLeaf(child))
  }

  return {
    id: subSection.id ?? '',
    title: extractStaticText(subSection.title as StaticText | undefined),
    screens,
  }
}

function walkForm(form: Form): FormIntrospection {
  const sections: SectionIntrospection[] = []

  for (const child of form.children) {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(walkSection(child as Section))
    }
  }

  return {
    id: form.id,
    title: extractStaticText(form.title),
    sections,
  }
}

function collectAllDescriptors(
  form: FormIntrospection,
): MessageDescriptorInfo[] {
  const all: MessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const add = (d: MessageDescriptorInfo) => {
    if (!seen.has(d.id)) {
      seen.add(d.id)
      all.push(d)
    }
  }

  for (const section of form.sections) {
    for (const screen of section.screens) {
      screen.messageDescriptors.forEach(add)
      screen.tableRepeaterColumnHeaders?.forEach(add)
      screen.staticTableHeaderDescriptors?.forEach(add)
      screen.staticTableRowCellDescriptors?.forEach(add)
      screen.staticTableSummary?.forEach((s) => {
        add(s.label)
        add(s.value)
      })
      screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
    }
    for (const subSection of section.subSections) {
      for (const screen of subSection.screens) {
        screen.messageDescriptors.forEach(add)
        screen.tableRepeaterColumnHeaders?.forEach(add)
        screen.staticTableHeaderDescriptors?.forEach(add)
        screen.staticTableRowCellDescriptors?.forEach(add)
        screen.staticTableSummary?.forEach((s) => {
          add(s.label)
          add(s.value)
        })
        screen.children?.forEach((c) => c.messageDescriptors.forEach(add))
      }
    }
  }

  return all
}

function serializeLoadedFormForApi(form: Form): unknown {
  try {
    return JSON.parse(JSON.stringify(form)) as unknown
  } catch (e) {
    throw new Error(
      `Loaded form could not be serialized to JSON: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
  }
}

@Injectable()
export class TemplateIntrospectionService {
  /**
   * Runs the template's `formLoader` for the given state and role (same as introspection)
   * and returns the raw form object as JSON-serializable data for admin tooling.
   */
  async loadRoleForm(
    typeId: ApplicationTypes,
    stateKey: string,
    roleId: string,
  ): Promise<unknown> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const statesConfig = template.stateMachineConfig?.states as
      | Record<string, unknown>
      | undefined
    if (!statesConfig || !statesConfig[stateKey]) {
      throw new Error(`Unknown state "${stateKey}" for template "${typeId}"`)
    }

    const stateConfig = statesConfig[stateKey] as Record<string, unknown>
    const meta = stateConfig.meta as Record<string, unknown> | undefined
    if (!meta) {
      throw new Error(`State "${stateKey}" has no meta`)
    }

    const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []
    const role = metaRoles.find((r) => String(r.id) === String(roleId))

    if (!role) {
      throw new Error(
        `Role "${roleId}" not found in state "${stateKey}" (template "${typeId}")`,
      )
    }

    if (!role.formLoader || typeof role.formLoader !== 'function') {
      throw new Error(
        `Role "${roleId}" in state "${stateKey}" has no formLoader`,
      )
    }

    const mockFeatureFlagClient = {
      getValue: () => Promise.resolve(undefined),
    }

    let form: Form
    try {
      form = await (
        role.formLoader as (args: {
          featureFlagClient: unknown
        }) => Promise<Form>
      )({ featureFlagClient: mockFeatureFlagClient })
    } catch (e) {
      throw new Error(
        `formLoader failed for "${typeId}" / "${stateKey}" / "${roleId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    return serializeLoadedFormForApi(form)
  }

  async introspectTemplate(
    typeId: ApplicationTypes,
  ): Promise<TemplateIntrospection> {
    let template
    try {
      template = await getApplicationTemplateByTypeId(typeId)
    } catch (e) {
      throw new Error(
        `Failed to load application template "${typeId}": ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
    }

    const config = ApplicationConfigurations[typeId]

    if (!config) {
      throw new Error(`No configuration found for template ${typeId}`)
    }

    const translationNamespaces = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]

    if (template.translationNamespaces) {
      translationNamespaces.push(...template.translationNamespaces)
    }

    const states: StateIntrospection[] = []
    const allDescriptors: MessageDescriptorInfo[] = []
    const seenDescriptorIds = new Set<string>()

    const statesConfig = template.stateMachineConfig?.states ?? {}
    for (const [stateKey, stateConfig] of Object.entries(statesConfig)) {
      const meta = (stateConfig as Record<string, unknown>).meta as
        | Record<string, unknown>
        | undefined
      if (!meta) continue

      const roles: RoleIntrospection[] = []
      const metaRoles = (meta.roles as Array<Record<string, unknown>>) ?? []

      for (const role of metaRoles) {
        let formIntrospection: FormIntrospection | null = null

        if (role.formLoader && typeof role.formLoader === 'function') {
          try {
            const mockFeatureFlagClient = {
              getValue: () => Promise.resolve(undefined),
            }
            const form = await (
              role.formLoader as (args: {
                featureFlagClient: unknown
              }) => Promise<Form>
            )({ featureFlagClient: mockFeatureFlagClient })

            formIntrospection = walkForm(form)

            const descriptors = collectAllDescriptors(formIntrospection)
            for (const d of descriptors) {
              if (!seenDescriptorIds.has(d.id)) {
                seenDescriptorIds.add(d.id)
                allDescriptors.push(d)
              }
            }
          } catch {
            // formLoader may fail in server context, skip gracefully
          }
        }

        roles.push({
          roleId: role.id as string,
          form: formIntrospection,
        })
      }

      states.push({
        stateKey,
        stateName: (meta.name as string) ?? stateKey,
        status: (meta.status as string) ?? 'draft',
        roles,
      })
    }

    const templateName = extractStaticText(
      typeof template.name === 'function' ? undefined : (template.name as StaticText),
    )

    return {
      typeId,
      name: templateName ?? config.slug,
      slug: config.slug,
      translationNamespaces: [...new Set(translationNamespaces)],
      states,
      allMessageDescriptors: allDescriptors,
    }
  }

  async listTemplates(): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    const templates: Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }> = []

    for (const [typeId, config] of Object.entries(ApplicationConfigurations)) {
      const translationNamespaces = Array.isArray(config.translation)
        ? config.translation
        : [config.translation]

      templates.push({
        typeId,
        name: config.slug,
        slug: config.slug,
        translationNamespaces,
      })
    }

    return templates
  }
}
