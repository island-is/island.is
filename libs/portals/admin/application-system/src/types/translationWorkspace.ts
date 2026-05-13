export interface MessageDescriptor {
  id: string
  defaultMessage?: string | null
  description?: string | null
}

export interface ValidationMessageDescriptor extends MessageDescriptor {
  fieldPath: string
}

export interface RadioOptionIntrospection {
  value: string
  labelMessageId?: string | null
  labelDefaultMessage?: string | null
}

export interface ScreenIntrospection {
  id: string
  type: string
  /** For `CUSTOM` fields: the component lookup key (e.g. `'ExampleCustomComponent'`). */
  component?: string | null
  title: string | null
  description?: string | null
  pageTitle?: string | null
  subTitle?: string | null
  subDescription?: string | null
  checkboxLabel?: string | null
  width?: string | null
  space?: number | null
  marginTop?: unknown
  marginBottom?: unknown
  paddingTop?: unknown
  /** Template `titleVariant` when present (e.g. DESCRIPTION fields). */
  titleVariant?: string | null
  messageDescriptors: MessageDescriptor[]
  children?: ScreenIntrospection[] | null
  radioOptions?: RadioOptionIntrospection[] | null
  radioLargeButtons?: boolean | null
  radioBackgroundColor?: string | null
  checkboxOptions?: RadioOptionIntrospection[] | null
  checkboxLarge?: boolean | null
  checkboxStrong?: boolean | null
  checkboxBackgroundColor?: string | null
  checkboxSpacing?: number | null
  tableRepeaterColumnHeaders?: MessageDescriptor[] | null
  tableRepeaterFormTitle?: string | null
  tableRepeaterAddItemButtonText?: string | null
  tableRepeaterCancelButtonText?: string | null
  tableRepeaterSaveItemButtonText?: string | null
  fieldsRepeaterFormTitle?: string | null
  fieldsRepeaterAddItemButtonText?: string | null
  fieldsRepeaterRemoveItemButtonText?: string | null
  nationalIdWithNameCustomNationalIdLabelText?: string | null
  nationalIdWithNameCustomNameLabelText?: string | null
  nationalIdWithNameShowPhoneField?: boolean | null
  nationalIdWithNameShowEmailField?: boolean | null
  nationalIdWithNamePhoneLabelText?: string | null
  nationalIdWithNameEmailLabelText?: string | null
  staticTableHeaderDescriptors?: MessageDescriptor[] | null
  staticTableRowCellDescriptors?: MessageDescriptor[] | null
  staticTableColumnCount?: number | null
  staticTableRowCount?: number | null
  staticTableHeaderFromFunction?: boolean | null
  staticTableRowsFromFunction?: boolean | null
  staticTableTitleVariant?: string | null
  staticTableSummary?: Array<{
    label: MessageDescriptor
    value: MessageDescriptor
  }> | null
  /** `ALERT_MESSAGE`: visual type of the alert box. */
  alertType?: string | null
  /** `ALERT_MESSAGE`: raw static text of the `message` body. */
  alertMessage?: string | null
  /** `FILEUPLOAD`: static text of the drag-and-drop header inside the upload box. */
  fileUploadHeader?: string | null
  /** `FILEUPLOAD`: static text of the accepted file types description inside the upload box. */
  fileUploadDescription?: string | null
  /** `FILEUPLOAD`: static text of the upload button label. */
  fileUploadButtonLabel?: string | null
  /** `FILEUPLOAD`: static text of the introduction rendered above the upload area. */
  fileUploadIntroduction?: string | null
}

/** Where in the template tree a sidebar row was clicked (for debugging / tooling). */
export interface SidebarNavLocation {
  stateKey: string
  stateName: string
  roleId: string
  sectionId: string
  sectionTitle?: string | null
  subsectionId?: string
  subsectionTitle?: string | null
  leafSourceScreenId?: string
}

/** Draft overrides per message key, split by preview locale so switching IS/EN does not drop work. */
export type EditedTranslations = {
  is: Record<string, string>
  en: Record<string, string>
}

export type ResolvePreviewString = (
  messageKey: string,
  defaultMessage?: string | null,
) => string

/** Matches `useLocale().formatMessage` for preview fallbacks (e.g. core messages). */
export type PreviewFormatMessage = (
  descriptor: { id: string; defaultMessage?: string | null },
  values?: Record<string, string | number | boolean | null | undefined>,
) => string

export interface TemplateSectionNav {
  id: string
  title?: string | null
  titleMessageDescriptor?: MessageDescriptor | null
  screens: ScreenIntrospection[]
  subSections: Array<{
    id: string
    title?: string | null
    titleMessageDescriptor?: MessageDescriptor | null
    screens: ScreenIntrospection[]
  }>
}

export interface TemplateStateNav {
  stateKey: string
  stateName: string
  roles: Array<{
    roleId: string
    form?: {
      logoKey?: string | null
      sections: TemplateSectionNav[]
    } | null
  }>
}
