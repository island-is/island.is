export interface MessageDescriptorInfo {
  id: string
  defaultMessage?: string
  description?: string
}

export interface ValidationMessageDescriptorInfo extends MessageDescriptorInfo {
  fieldPath: string
}

/** Radio option labels for admin translation preview (static or message-backed). */
export interface RadioOptionIntrospection {
  value: string
  labelMessageId?: string | null
  labelDefaultMessage?: string | null
}

/** Submit button labels for admin translation preview (static or message-backed). */
export interface SubmitActionIntrospection {
  event: string
  labelMessageId?: string | null
  labelDefaultMessage?: string | null
  buttonType: string
}

export interface ScreenIntrospection {
  id: string
  type: string
  /** For `CUSTOM` fields: the component lookup key (e.g. `'ExampleCustomComponent'`). */
  component?: string | null
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
  /**
   * `TEXT` / `PHONE` / `DATE` / `SELECT` / etc.: mirrors template `field.backgroundColor` (`'white' | 'blue'`).
   * Translation workspace preview defaults to blue when unset; only `'white'` yields a white input.
   */
  inputBackgroundColor?: string | null
  /** `TEXT`: mirrors `TextField.variant` (e.g. `text`, `textarea`, `currency`). */
  textFieldVariant?: string | null
  /** `TEXT`: `rows` when `variant` is `textarea`. */
  textFieldRows?: number | null
  /**
   * Static / default-language snippet for `placeholder` when present (mirrors `title`);
   * resolve translatable copy via `messageDescriptors` in the preview.
   */
  inputPlaceholder?: string | null
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
  /** `ALERT_MESSAGE`: visual type of the alert box (error, warning, info, success, default). */
  alertType?: string | null
  /** `ALERT_MESSAGE`: raw static text of the `message` body (resolve via descriptors). */
  alertMessage?: string | null
  /** `FILEUPLOAD`: static text of the drag-and-drop header inside the upload box. */
  fileUploadHeader?: string | null
  /** `FILEUPLOAD`: static text of the accepted file types description inside the upload box. */
  fileUploadDescription?: string | null
  /** `FILEUPLOAD`: static text of the upload button label. */
  fileUploadButtonLabel?: string | null
  /** `FILEUPLOAD`: static text of the introduction rendered above the upload area. */
  fileUploadIntroduction?: string | null
  /** `SUBMIT`: matches `SubmitField.placement` (`footer` renders in preview chrome). */
  submitPlacement?: string | null
  /** `SUBMIT`: template actions for translation preview / footer buttons. */
  submitActions?: SubmitActionIntrospection[]
  /** `DISPLAY`: message id for `label` when the template uses a react-intl descriptor. */
  displayLabelMessageId?: string | null
  /** `DISPLAY`: message id for `suffix` when the template uses a react-intl descriptor. */
  displaySuffixMessageId?: string | null
  /** `DISPLAY`: plain string `label` when `label` is not message-backed. */
  displayLabelStatic?: string | null
  /** `DISPLAY`: plain string `suffix` when `suffix` is not message-backed. */
  displaySuffixStatic?: string | null
  /** `IMAGE`: URL when the template `image` prop is a string. */
  imageUrl?: string | null
  /** `IMAGE`: component `name` / `displayName` when `image` is an SVG React component. */
  imageSvgComponentName?: string | null
  /** `IMAGE`: `alt` text when set. */
  imageAlt?: string | null
  /** `IMAGE`: `imageWidth` (`string` or per-breakpoint array). */
  imageWidth?: unknown
  /** `IMAGE`: `imagePosition` (`string` or per-breakpoint array). */
  imagePosition?: unknown
  /** `LINK`: `extractStaticText` of `link` when not message-backed. */
  linkFieldLinkText?: string | null
  /** `LINK`: react-intl id when `link` is a `MessageDescriptor`. */
  linkFieldLinkMessageId?: string | null
  /** `LINK`: `extractStaticText` of `s3key` when not message-backed. */
  linkFieldS3KeyText?: string | null
  /** `LINK`: react-intl id when `s3key` is a `MessageDescriptor`. */
  linkFieldS3KeyMessageId?: string | null
  /** `LINK`: react-intl id when `title` (button label) is a `MessageDescriptor`. */
  linkFieldTitleMessageId?: string | null
  /** `LINK`: `variant` from template (`ghost` \| `text`). */
  linkFieldVariant?: string | null
  /** `LINK`: `justifyContent` from template. */
  linkFieldJustifyContent?: string | null
  /** `LINK`: `iconProps.icon` when set. */
  linkFieldIcon?: string | null
  /** `LINK`: `iconProps.type` when set (`outline` \| `filled`). */
  linkFieldIconType?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: outbound link URL/path from template. */
  messageWithLinkUrl?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: `extractStaticText` of `message` when not message-backed. */
  messageWithLinkMessageStatic?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: react-intl id when `message` is message-backed. */
  messageWithLinkMessageId?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: static `buttonTitle` when not message-backed. */
  messageWithLinkButtonTitleStatic?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: react-intl id when `buttonTitle` is message-backed. */
  messageWithLinkButtonTitleMessageId?: string | null
  /** `MESSAGE_WITH_LINK_BUTTON_FIELD`: optional `messageColor` from template (`Text` color token string). */
  messageWithLinkMessageColor?: string | null
}

export interface SubSectionIntrospection {
  id: string
  title: string | null
  /** Message descriptor for `subSection.title` when message-backed. */
  titleMessageDescriptor: MessageDescriptorInfo | null
  screens: ScreenIntrospection[]
}

export interface SectionIntrospection {
  id: string
  title: string | null
  /** Message descriptor for `section.title` when message-backed. */
  titleMessageDescriptor: MessageDescriptorInfo | null
  subSections: SubSectionIntrospection[]
  screens: ScreenIntrospection[]
}

export interface FormIntrospection {
  id: string
  title: string | null
  /**
   * Resolved name of a static `form.logo` component (e.g. `HmsLogo`) for admin preview.
   * `null` when there is no logo, when `logo` is an application-dependent factory (`fn.length > 0`),
   * or when the function has no usable `name` / `displayName`.
   */
  logoKey: string | null
  sections: SectionIntrospection[]
}

export interface RoleIntrospection {
  roleId: string
  form: FormIntrospection | null
}

export interface StateIntrospection {
  stateKey: string
  stateName: string
  status: string
  roles: RoleIntrospection[]
}

export interface TemplateIntrospection {
  typeId: string
  name: string
  slug: string
  translationNamespaces: string[]
  states: StateIntrospection[]
  allMessageDescriptors: MessageDescriptorInfo[]
  validationMessageDescriptors: ValidationMessageDescriptorInfo[]
}
