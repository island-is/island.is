import type {
  AlertMessageField,
  CheckboxField,
  DataProviderItem,
  Field,
  FileUploadField,
  Form,
  FormLeaf,
  FormText,
  LinkField,
  MessageWithLinkButtonField,
  MultiField,
  NationalIdWithNameField,
  OverviewField,
  RadioField,
  Section,
  StaticTableField,
  StaticText,
  SubSection,
  SubmitField,
  TableRepeaterField,
  FieldsRepeaterField,
} from '@island.is/application/types'
import { FieldTypes, FormItemTypes } from '@island.is/application/types'
import type {
  FormIntrospection,
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  ScreenIntrospection,
  SectionIntrospection,
  SubSectionIntrospection,
  SubmitActionIntrospection,
} from '@island.is/application/types'
import {
  displayFieldStaticIntrospectionFromLeaf,
  enrichNationalIdWithNameFieldDescriptors,
  extractInputBackgroundColorFromLeaf,
  extractMessageDescriptorsFromField,
  imageFieldIntrospectionFromLeaf,
  textFieldIntrospectionFromLeaf,
} from './field-introspection.util'
import {
  addDescriptorIfNew,
  extractMessageDescriptorsFromFormText,
  extractStaticText,
  isMessageDescriptor,
  mergeMessageDescriptors,
  tryInvokeFormTextFunction,
} from './message-descriptor.util'
import {
  extractCheckboxPreviewOptions,
  extractOverviewItemsDescriptorsBestEffort,
  extractRadioPreviewOptions,
  extractStaticId,
  extractSubmitActionsForPreview,
} from './preview-stub.util'
import {
  walkFieldsRepeaterScreen,
  walkTableRepeaterScreen,
} from './repeater-introspection.util'

export const walkExternalDataSourceItem = (
  syntheticId: string,
  provider: DataProviderItem,
): ScreenIntrospection => {
  const descriptors: MessageDescriptorInfo[] = []
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.pageTitle as FormText | undefined,
    ),
  )
  descriptors.push(
    ...extractMessageDescriptorsFromFormText(
      provider.title as FormText | undefined,
    ),
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

export const walkStaticTableScreen = (st: StaticTableField): ScreenIntrospection => {
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
    id: extractStaticId(st.id) || 'staticTable',
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

export const walkFormLeaf = (
  leaf: FormLeaf,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): ScreenIntrospection => {
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

  const fileUploadMeta: {
    fileUploadHeader?: string | null
    fileUploadDescription?: string | null
    fileUploadButtonLabel?: string | null
    fileUploadIntroduction?: string | null
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
  let submitPlacementOut: string | null | undefined
  let submitActionsOut: SubmitActionIntrospection[] | undefined
  let inputPlaceholder: string | null = null

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
        const childScreen = walkFormLeaf(child, customFieldManifest)
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
    subDescription = extractStaticText(
      edp.subDescription as StaticText | undefined,
    )
    checkboxLabel = extractStaticText(
      edp.checkboxLabel as StaticText | undefined,
    )

    const externalDataLeafId = extractStaticId(leaf.id) || 'external'
    const dataProviders =
      (edp.dataProviders as DataProviderItem[] | undefined) ?? []
    for (const provider of dataProviders) {
      if (!provider?.id) continue
      const childScreen = walkExternalDataSourceItem(
        `${externalDataLeafId}::${extractStaticId(provider.id) || 'provider'}`,
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
        `${externalDataLeafId}::perm::${
          extractStaticId(permission.id) || 'permission'
        }`,
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
    if (leaf.type === FieldTypes.SUBMIT) {
      const sf = leaf as SubmitField
      for (const action of sf.actions) {
        fromField = mergeMessageDescriptors(
          fromField,
          extractMessageDescriptorsFromFormText(action.name),
        )
      }
      submitPlacementOut = sf.placement ?? 'footer'
      submitActionsOut = extractSubmitActionsForPreview(sf)
    }
    if (leaf.type === FieldTypes.OVERVIEW) {
      fromField = mergeMessageDescriptors(
        fromField,
        extractOverviewItemsDescriptorsBestEffort(field as OverviewField),
      )
    }
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
    if (leaf.type === FieldTypes.FILEUPLOAD) {
      const fu = leaf as FileUploadField
      const pushFileUploadDescriptor = (t: unknown) => {
        if (t) {
          for (const d of extractMessageDescriptorsFromFormText(
            t as FormText,
          )) {
            if (!fromField.some((x) => x.id === d.id)) {
              fromField.push(d)
            }
          }
        }
      }
      pushFileUploadDescriptor(fu.introduction)
      pushFileUploadDescriptor(fu.uploadHeader)
      pushFileUploadDescriptor(fu.uploadDescription)
      pushFileUploadDescriptor(fu.uploadButtonLabel)
      fileUploadMeta.fileUploadHeader = extractStaticText(
        fu.uploadHeader as StaticText | undefined,
      )
      fileUploadMeta.fileUploadDescription = extractStaticText(
        fu.uploadDescription as StaticText | undefined,
      )
      fileUploadMeta.fileUploadButtonLabel = extractStaticText(
        fu.uploadButtonLabel as StaticText | undefined,
      )
      fileUploadMeta.fileUploadIntroduction = extractStaticText(
        fu.introduction as StaticText | undefined,
      )
    }
    if ('placeholder' in field && field.placeholder !== undefined) {
      const ph = field.placeholder as FormText | undefined
      if (typeof ph === 'function') {
        const extracted = tryInvokeFormTextFunction(ph as Function)
        fromField = mergeMessageDescriptors(fromField, extracted.descriptors)
        inputPlaceholder = extracted.staticText
      } else {
        inputPlaceholder = extractStaticText(ph as StaticText | undefined)
      }
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

  const inputBackgroundColor = extractInputBackgroundColorFromLeaf(leaf)

  let alertType: string | null | undefined
  let alertMessage: string | null | undefined

  if (leaf.type === FieldTypes.ALERT_MESSAGE) {
    const amf = leaf as AlertMessageField
    alertType = amf.alertType ?? 'default'
    if (typeof amf.message === 'function') {
      const extracted = tryInvokeFormTextFunction(amf.message)
      for (const d of extracted.descriptors) {
        if (!descriptors.some((x) => x.id === d.id)) {
          descriptors.push(d)
        }
      }
      alertMessage = extracted.staticText
    } else {
      alertMessage = extractStaticText(amf.message as StaticText | undefined)
    }
  }

  let messageDescriptorsOut = descriptors
  if (leaf.type === FieldTypes.CUSTOM && customFieldManifest) {
    const comp =
      typeof leafRecord.component === 'string' ? leafRecord.component : ''
    const extra = comp ? customFieldManifest[comp] : undefined
    if (extra?.length) {
      messageDescriptorsOut = mergeMessageDescriptors(descriptors, extra)
    }
  }

  const linkFieldExtras =
    leaf.type === FieldTypes.LINK
      ? (() => {
          const lf = leaf as LinkField
          return {
            linkFieldLinkText: extractStaticText(
              lf.link as StaticText | undefined,
            ),
            linkFieldLinkMessageId:
              lf.link != null && isMessageDescriptor(lf.link)
                ? String(lf.link.id)
                : null,
            linkFieldS3KeyText: extractStaticText(
              lf.s3key as StaticText | undefined,
            ),
            linkFieldS3KeyMessageId:
              lf.s3key != null && isMessageDescriptor(lf.s3key)
                ? String(lf.s3key.id)
                : null,
            linkFieldTitleMessageId:
              lf.title != null && isMessageDescriptor(lf.title)
                ? String(lf.title.id)
                : null,
            linkFieldVariant:
              lf.variant === 'text' || lf.variant === 'ghost'
                ? lf.variant
                : null,
            linkFieldJustifyContent:
              lf.justifyContent === 'center' ||
              lf.justifyContent === 'flexEnd' ||
              lf.justifyContent === 'flexStart'
                ? lf.justifyContent
                : null,
            linkFieldIcon:
              lf.iconProps?.icon != null ? String(lf.iconProps.icon) : null,
            linkFieldIconType:
              lf.iconProps?.type != null ? String(lf.iconProps.type) : null,
          }
        })()
      : {}

  const messageWithLinkExtras =
    leaf.type === FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD
      ? (() => {
          const mf = leaf as MessageWithLinkButtonField
          return {
            messageWithLinkUrl: mf.url ?? null,
            messageWithLinkMessageStatic: extractStaticText(
              mf.message as StaticText | undefined,
            ),
            messageWithLinkMessageId:
              mf.message != null && isMessageDescriptor(mf.message)
                ? String(mf.message.id)
                : null,
            messageWithLinkButtonTitleStatic: extractStaticText(
              mf.buttonTitle as StaticText | undefined,
            ),
            messageWithLinkButtonTitleMessageId:
              mf.buttonTitle != null && isMessageDescriptor(mf.buttonTitle)
                ? String(mf.buttonTitle.id)
                : null,
            messageWithLinkMessageColor:
              mf.messageColor != null ? String(mf.messageColor) : null,
          }
        })()
      : {}

  return {
    id: extractStaticId(leaf.id),
    type: leaf.type ?? 'FIELD',
    component: (leafRecord.component as string) ?? null,
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
    messageDescriptors: messageDescriptorsOut,
    children: children.length > 0 ? children : undefined,
    radioOptions,
    radioLargeButtons,
    radioBackgroundColor,
    checkboxOptions,
    checkboxLarge,
    checkboxStrong,
    checkboxBackgroundColor,
    checkboxSpacing,
    inputBackgroundColor,
    inputPlaceholder,
    alertType,
    alertMessage,
    ...nifMeta,
    ...fileUploadMeta,
    ...displayFieldStaticIntrospectionFromLeaf(leaf),
    ...textFieldIntrospectionFromLeaf(leaf),
    ...imageFieldIntrospectionFromLeaf(leaf),
    ...(submitPlacementOut !== undefined
      ? {
          submitPlacement: submitPlacementOut,
          submitActions: submitActionsOut,
        }
      : {}),
    ...linkFieldExtras,
    ...messageWithLinkExtras,
  }
}

export const walkSection = (
  section: Section,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): SectionIntrospection => {
  const subSections: SubSectionIntrospection[] = []
  const screens: ScreenIntrospection[] = []

  for (const child of section.children) {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(walkSubSection(child as SubSection, customFieldManifest))
    } else {
      screens.push(walkFormLeaf(child as FormLeaf, customFieldManifest))
    }
  }

  return {
    id: extractStaticId(section.id),
    title: extractStaticText(section.title as StaticText | undefined),
    titleMessageDescriptor:
      extractMessageDescriptorsFromFormText(section.title as FormText)[0] ??
      null,
    subSections,
    screens,
  }
}

export const walkSubSection = (
  subSection: SubSection,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): SubSectionIntrospection => {
  const screens: ScreenIntrospection[] = []

  for (const child of subSection.children) {
    screens.push(walkFormLeaf(child, customFieldManifest))
  }

  return {
    id: extractStaticId(subSection.id),
    title: extractStaticText(subSection.title as StaticText | undefined),
    titleMessageDescriptor:
      extractMessageDescriptorsFromFormText(subSection.title as FormText)[0] ??
      null,
    screens,
  }
}

export const extractFormLogoKey = (logo: Form['logo'] | undefined): string | null => {
  if (!logo || typeof logo !== 'function') {
    return null
  }
  const fn = logo as Function & { displayName?: string }
  // Application-dependent logo: `(application) => …`
  if (fn.length > 0) {
    return null
  }
  const key = (fn.displayName || fn.name || '').trim()
  if (!key || key === 'anonymous') {
    return null
  }
  return key
}

export const walkForm = (
  form: Form,
  customFieldManifest?: Record<string, MessageDescriptorInfo[]>,
): FormIntrospection => {
  const sections: SectionIntrospection[] = []

  for (const child of form.children) {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(walkSection(child as Section, customFieldManifest))
    }
  }

  return {
    id: form.id,
    title: extractStaticText(form.title),
    logoKey: extractFormLogoKey(form.logo),
    sections,
  }
}

export const collectAllDescriptors = (
  form: FormIntrospection,
): MessageDescriptorInfo[] => {
  const all: MessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const add = (d: MessageDescriptorInfo) => {
    if (!seen.has(d.id)) {
      seen.add(d.id)
      all.push(d)
    }
  }

  for (const section of form.sections) {
    if (section.titleMessageDescriptor) {
      add(section.titleMessageDescriptor)
    }
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
      if (subSection.titleMessageDescriptor) {
        add(subSection.titleMessageDescriptor)
      }
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

export const serializeLoadedFormForApi = (form: Form): unknown => {
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
