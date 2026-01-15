import {
  AlertMessageField,
  Application,
  AsyncSelectField,
  BaseField,
  CallToAction,
  CheckboxField,
  CompanySearchField,
  Condition,
  CustomField,
  DateField,
  DescriptionField,
  DividerField,
  ExpandableDescriptionField,
  Field,
  FieldComponents,
  FieldTypes,
  FieldWidth,
  FileUploadField,
  FormText,
  FormTextArray,
  KeyValueField,
  LinkField,
  MessageWithLinkButtonField,
  Option,
  PaymentChargeOverviewField,
  PaymentPendingField,
  PdfLinkButtonField,
  PhoneField,
  RadioField,
  RecordObject,
  RedirectToServicePortalField,
  SelectField,
  SubmitField,
  TextField,
  ImageField,
  NationalIdWithNameField,
  ActionCardListField,
  TableRepeaterField,
  StaticTableField,
  HiddenInputWithWatchedValueField,
  HiddenInputField,
  SliderField,
  MaybeWithApplication,
  MaybeWithApplicationAndFieldAndLocale,
  InformationCardField,
  DisplayField,
  FieldsRepeaterField,
  AccordionField,
  BankAccountField,
  TitleField,
  TitleVariants,
  OverviewField,
  CopyLinkField,
  VehiclePermnoWithInfoField,
  MaybeWithAnswersAndExternalData,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { Colors } from '@island.is/island-ui/theme'
import { SpanType, BoxProps } from '@island.is/island-ui/core/types'
import { coreDefaultFieldMessages } from './messages'
import {
  DEFAULT_ALLOWED_FILE_TYPES,
  DEFAULT_FILE_SIZE_LIMIT,
  DEFAULT_TOTAL_FILE_SIZE_SUM,
} from './constants'

const extractCommonFields = (
  data: Omit<BaseField, 'type' | 'component' | 'children'>,
) => {
  const {
    condition,
    defaultValue,
    description,
    disabled = false,
    doesNotRequireAnswer = false,
    id,
    title = '',
    dataTestId,
    width = 'full',
    nextButtonText,
    marginBottom,
    marginTop,
    clearOnChange,
    clearOnChangeDefaultValue,
    setOnChange,
  } = data

  return {
    id,
    condition,
    defaultValue,
    description,
    disabled,
    dataTestId,
    doesNotRequireAnswer,
    title,
    width,
    nextButtonText,
    marginBottom,
    marginTop,
    clearOnChange,
    clearOnChangeDefaultValue,
    setOnChange,
  }
}

export const buildCheckboxField = (
  data: Omit<CheckboxField, 'type' | 'component' | 'children'>,
): CheckboxField => {
  const {
    options,
    strong = false,
    large = true,
    required,
    backgroundColor = 'blue',
    spacing,
    clearOnChange,
    clearOnChangeDefaultValue,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    large,
    strong,
    backgroundColor,
    options,
    required,
    spacing,
    clearOnChange,
    clearOnChangeDefaultValue,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export const buildDateField = (
  data: Omit<DateField, 'type' | 'component' | 'children'>,
): DateField => {
  const {
    maxDate,
    minDate,
    minYear,
    maxYear,
    excludeDates,
    placeholder,
    backgroundColor = 'blue',
    required,
    readOnly,
    tempDisabled,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    maxDate,
    minDate,
    minYear,
    maxYear,
    excludeDates,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
    backgroundColor,
    required,
    readOnly,
    tempDisabled,
  }
}

export const buildDescriptionField = (
  data: Omit<DescriptionField, 'type' | 'component' | 'children'>,
): DescriptionField => {
  const {
    titleVariant = 'h2',
    description,
    tooltip,
    titleTooltip,
    space,
    doesNotRequireAnswer = true,
  } = data
  return {
    ...extractCommonFields(data),
    doesNotRequireAnswer,
    children: undefined,
    description,
    titleVariant,
    tooltip,
    titleTooltip,
    space,
    type: FieldTypes.DESCRIPTION,
    component: FieldComponents.DESCRIPTION,
  }
}

export const buildRadioField = (
  data: Omit<RadioField, 'type' | 'component' | 'children'>,
): RadioField => {
  const {
    options,
    largeButtons = true,
    backgroundColor,
    space,
    required,
    widthWithIllustration,
    hasIllustration,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    largeButtons,
    options,
    backgroundColor,
    space,
    required,
    widthWithIllustration,
    hasIllustration,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export const buildSelectField = (
  data: Omit<SelectField, 'type' | 'component' | 'children'>,
): SelectField => {
  const {
    options,
    placeholder,
    onSelect,
    backgroundColor = 'blue',
    isMulti,
    isClearable,
    required,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    options,
    required,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
    onSelect,
    isMulti,
    isClearable,
    backgroundColor,
  }
}

export const buildAsyncSelectField = (
  data: Omit<AsyncSelectField, 'type' | 'component' | 'children'>,
): AsyncSelectField => {
  const {
    loadOptions,
    loadingError,
    placeholder,
    onSelect,
    backgroundColor = 'blue',
    isSearchable,
    isMulti,
    updateOnSelect,
    isClearable,
    required,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    loadOptions,
    loadingError,
    type: FieldTypes.ASYNC_SELECT,
    component: FieldComponents.ASYNC_SELECT,
    onSelect,
    backgroundColor,
    isSearchable,
    isMulti,
    updateOnSelect,
    isClearable,
    required,
  }
}

export const buildCompanySearchField = (
  data: Omit<CompanySearchField, 'type' | 'component' | 'children'>,
): CompanySearchField => {
  const {
    placeholder,
    shouldIncludeIsatNumber,
    checkIfEmployerIsOnForbiddenList,
    required,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    shouldIncludeIsatNumber,
    checkIfEmployerIsOnForbiddenList,
    required,
    type: FieldTypes.COMPANY_SEARCH,
    component: FieldComponents.COMPANY_SEARCH,
  }
}

export const buildTextField = (
  data: Omit<TextField, 'type' | 'component' | 'children'>,
): TextField => {
  const {
    backgroundColor = 'blue',
    placeholder,
    variant = 'text',
    format,
    thousandSeparator,
    suffix,
    rows,
    required,
    maxLength,
    showMaxLength,
    max,
    min,
    readOnly,
    rightAlign,
    tooltip,
    onChange,
    allowNegative,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    allowNegative,
    placeholder,
    backgroundColor,
    variant,
    format,
    thousandSeparator,
    suffix,
    rows,
    required,
    maxLength,
    showMaxLength,
    readOnly,
    rightAlign,
    max,
    min,
    tooltip,
    onChange,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export const buildPhoneField = (
  data: Omit<PhoneField, 'type' | 'component' | 'children'>,
): PhoneField => {
  const {
    backgroundColor = 'blue',
    placeholder,
    required,
    readOnly,
    rightAlign,
    allowedCountryCodes,
    enableCountrySelector,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    backgroundColor,
    required,
    readOnly,
    allowedCountryCodes,
    enableCountrySelector,
    rightAlign,
    type: FieldTypes.PHONE,
    component: FieldComponents.PHONE,
  }
}

export const buildCustomField = (
  data: Omit<CustomField, 'props' | 'type' | 'children'>,
  props?: RecordObject,
): CustomField => {
  const { component, childInputIds } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    childInputIds,
    type: FieldTypes.CUSTOM,
    component,
    props: props ?? {},
  }
}

export const buildFileUploadField = (
  data: Omit<FileUploadField, 'type' | 'component' | 'children'>,
): FileUploadField => {
  const {
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
    totalMaxSize,
    maxFileCount,
    forImageUpload,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    introduction: introduction,
    uploadHeader:
      uploadHeader || coreDefaultFieldMessages.defaultFileUploadHeader,
    uploadDescription:
      uploadDescription ||
      coreDefaultFieldMessages.defaultFileUploadDescription,
    uploadButtonLabel:
      uploadButtonLabel ||
      coreDefaultFieldMessages.defaultFileUploadButtonLabel,
    uploadMultiple,
    uploadAccept: uploadAccept ?? DEFAULT_ALLOWED_FILE_TYPES,
    maxSize: maxSize ?? DEFAULT_FILE_SIZE_LIMIT,
    maxSizeErrorText,
    totalMaxSize: totalMaxSize ?? DEFAULT_TOTAL_FILE_SIZE_SUM,
    maxFileCount,
    forImageUpload,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export const buildDividerField = (data: {
  condition?: Condition
  useDividerLine?: boolean
  marginBottom?: BoxProps['marginBottom']
  marginTop?: BoxProps['marginTop']
}): DividerField => {
  const { useDividerLine = true, condition, marginTop, marginBottom } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    doesNotRequireAnswer: true,
    title: '',
    useDividerLine,
    condition,
    marginTop,
    marginBottom,
  }
}

export const buildTitleField = (data: {
  condition?: Condition
  title?: FormText
  titleVariant?: TitleVariants
  color?: Colors
  marginBottom?: BoxProps['marginBottom']
  marginTop?: BoxProps['marginTop']
}): TitleField => {
  const { title, titleVariant, color, condition, marginTop, marginBottom } =
    data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.TITLE,
    component: FieldComponents.TITLE,
    doesNotRequireAnswer: true,
    title: title ?? '',
    titleVariant: titleVariant,
    color,
    condition,
    marginTop,
    marginBottom,
  }
}

export const buildKeyValueField = (data: {
  label: FormText
  value: FormText | FormTextArray
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
  display?: 'block' | 'flex'
  divider?: boolean
  paddingX?: BoxProps['padding']
  paddingY?: BoxProps['padding']
  paddingBottom?: BoxProps['padding']
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  tooltip?: FormText
}): KeyValueField => {
  const {
    label,
    value,
    condition,
    width = 'full',
    colSpan,
    display = 'block',
    divider = false,
    paddingX,
    paddingY,
    paddingBottom,
    marginTop,
    marginBottom,
    tooltip,
  } = data

  return {
    id: '',
    title: '',
    children: undefined,
    doesNotRequireAnswer: true,
    condition,
    width,
    colSpan,
    label,
    value,
    divider,
    type: FieldTypes.KEY_VALUE,
    component: FieldComponents.KEY_VALUE,
    display,
    paddingX,
    paddingY,
    paddingBottom,
    marginTop,
    marginBottom,
    tooltip,
  }
}

export const buildSubmitField = (data: {
  id: string
  title?: FormText
  placement?: 'footer' | 'screen'
  marginBottom?: BoxProps['marginBottom']
  marginTop?: BoxProps['marginTop']
  refetchApplicationAfterSubmit?: boolean | ((event?: string) => boolean)
  actions: CallToAction[]
  condition?: Condition
}): SubmitField => {
  const {
    id,
    placement = 'footer',
    title = '',
    actions,
    condition,
    refetchApplicationAfterSubmit,
    marginTop,
    marginBottom,
  } = data
  return {
    children: undefined,
    id,
    title,
    actions,
    placement,
    condition,
    doesNotRequireAnswer: true,
    refetchApplicationAfterSubmit:
      typeof refetchApplicationAfterSubmit !== 'undefined'
        ? refetchApplicationAfterSubmit
        : false,
    marginTop,
    marginBottom,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}

export const buildFieldItems = (
  maybeItems: MaybeWithApplicationAndFieldAndLocale<
    Array<{ label: FormText; value: FormText | FormTextArray }>
  >,
  application: Application,
  field: Field,
  locale: Locale,
): Array<{ label: FormText; value: FormText | FormTextArray }> => {
  if (typeof maybeItems === 'function') {
    return maybeItems(application, field, locale)
  }
  return maybeItems
}

export const buildFieldOptions = (
  maybeOptions: MaybeWithApplicationAndFieldAndLocale<Option[]>,
  application: Application,
  field: Field,
  locale: Locale,
): Option[] => {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application, field, locale)
  }
  return maybeOptions
}

export const buildFieldRequired = (
  application: Application,
  maybeRequired?: MaybeWithApplication<boolean>,
) => {
  if (typeof maybeRequired === 'function') {
    return maybeRequired(application)
  }
  return maybeRequired
}

export const buildFieldReadOnly = (
  application: Application,
  maybeReadOnly?: MaybeWithAnswersAndExternalData<boolean>,
) => {
  if (typeof maybeReadOnly === 'function') {
    return maybeReadOnly(application.answers, application.externalData)
  }
  return maybeReadOnly
}

export const buildRedirectToServicePortalField = (data: {
  id: string
  title?: FormText
  marginBottom?: BoxProps['marginBottom']
  marginTop?: BoxProps['marginTop']
}): RedirectToServicePortalField => {
  const { id, title = '', marginTop, marginBottom } = data
  return {
    children: undefined,
    id,
    title,
    marginTop,
    marginBottom,
    type: FieldTypes.REDIRECT_TO_SERVICE_PORTAL,
    component: FieldComponents.REDIRECT_TO_SERVICE_PORTAL,
  }
}

export const buildPaymentPendingField = (data: {
  id: string
  title: FormText
}): PaymentPendingField => {
  const { id, title } = data
  return {
    children: undefined,
    id,
    title,
    type: FieldTypes.PAYMENT_PENDING,
    component: FieldComponents.PAYMENT_PENDING,
  }
}

export const buildMessageWithLinkButtonField = (
  data: Omit<MessageWithLinkButtonField, 'type' | 'component' | 'children'>,
): MessageWithLinkButtonField => {
  const { id, url, message, messageColor, buttonTitle } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    id,
    url,
    message,
    messageColor,
    buttonTitle,
    type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
    component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
  }
}

export const buildExpandableDescriptionField = (
  data: Omit<ExpandableDescriptionField, 'type' | 'component' | 'children'>,
): ExpandableDescriptionField => {
  const { id, description, introText, startExpanded } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    id,
    description,
    introText,
    startExpanded,
    type: FieldTypes.EXPANDABLE_DESCRIPTION,
    component: FieldComponents.EXPANDABLE_DESCRIPTION,
  }
}

export const buildAlertMessageField = (
  data: Omit<AlertMessageField, 'type' | 'component' | 'children'>,
): AlertMessageField => {
  const {
    message,
    alertType,
    links,
    shouldBlockInSetBeforeSubmitCallback,
    allowMultipleSetBeforeSubmitCallbacks,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    message,
    alertType,
    type: FieldTypes.ALERT_MESSAGE,
    component: FieldComponents.ALERT_MESSAGE,
    links,
    shouldBlockInSetBeforeSubmitCallback,
    allowMultipleSetBeforeSubmitCallbacks,
    doesNotRequireAnswer: data.doesNotRequireAnswer ?? true,
  }
}

export const buildLinkField = (
  data: Omit<LinkField, 'type' | 'component' | 'children'>,
): LinkField => {
  const {
    s3key,
    link,
    iconProps,
    variant = 'ghost',
    justifyContent = 'flexStart',
  } = data
  return {
    ...extractCommonFields(data),
    s3key,
    link,
    iconProps,
    variant,
    justifyContent,
    children: undefined,
    type: FieldTypes.LINK,
    component: FieldComponents.LINK,
  }
}

export const buildPaymentChargeOverviewField = (
  data: Omit<PaymentChargeOverviewField, 'type' | 'component' | 'children'>,
): PaymentChargeOverviewField => {
  const {
    id,
    forPaymentLabel,
    totalLabel,
    quantityLabel,
    quantityUnitLabel,
    unitPriceLabel,
    totalPerUnitLabel,
    getSelectedChargeItems,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    id,
    forPaymentLabel,
    totalLabel,
    quantityLabel,
    quantityUnitLabel,
    unitPriceLabel,
    totalPerUnitLabel,
    getSelectedChargeItems,
    type: FieldTypes.PAYMENT_CHARGE_OVERVIEW,
    component: FieldComponents.PAYMENT_CHARGE_OVERVIEW,
  }
}

export const buildImageField = (
  data: Omit<ImageField, 'type' | 'component' | 'children'>,
): ImageField => {
  const {
    id,
    image,
    alt,
    condition,
    titleVariant = 'h4',
    // imageWidth and imagePosition can be arrays [sm,  md, lg, xl] for different screen sizes
    imageWidth = 'full',
    imagePosition = 'left',
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    id,
    image,
    alt,
    imageWidth,
    condition,
    titleVariant,
    imagePosition,
    type: FieldTypes.IMAGE,
    component: FieldComponents.IMAGE,
    doesNotRequireAnswer: data.doesNotRequireAnswer ?? true,
  }
}

export const buildPdfLinkButtonField = (
  data: Omit<PdfLinkButtonField, 'type' | 'component' | 'children'>,
): PdfLinkButtonField => {
  const {
    verificationDescription,
    verificationLinkTitle,
    verificationLinkUrl,
    getPdfFiles,
    setViewPdfFile,
    viewPdfFile = false,
    downloadButtonTitle,
  } = data
  return {
    ...extractCommonFields(data),
    verificationDescription,
    verificationLinkTitle,
    verificationLinkUrl,
    getPdfFiles,
    setViewPdfFile,
    viewPdfFile,
    downloadButtonTitle:
      downloadButtonTitle ||
      coreDefaultFieldMessages.defaultDownloadButtonTitle,
    children: undefined,
    type: FieldTypes.PDF_LINK_BUTTON,
    component: FieldComponents.PDF_LINK_BUTTON,
  }
}

/**
 * Constructs a hidden input field configuration object with a watched value.
 * This function is specifically designed for creating hidden input fields that dynamically
 * update their value based on the value of another field specified by `watchValue`.
 *
 * @param {Omit<HiddenInputWithWatchedValueField, 'type' | 'component' | 'children' | 'title'>} data
 * - `id`: Unique identifier for the hidden input field, this will get stored in answers.
 * - `watchValue`: The answer id that this hidden input should watch and update its value accordingly.
 * - `valueModifier`: An optional function to modify the watched value before setting it.
 */
export const buildHiddenInputWithWatchedValue = (
  data: Omit<
    HiddenInputWithWatchedValueField,
    'type' | 'component' | 'children' | 'title'
  >,
): HiddenInputWithWatchedValueField => {
  return {
    ...extractCommonFields({ title: '', ...data }),
    id: data.id,
    type: FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE,
    component: FieldComponents.HIDDEN_INPUT,
    valueModifier: data.valueModifier,
    watchValue: data.watchValue,
    title: '',
    children: undefined,
    doesNotRequireAnswer: data.doesNotRequireAnswer ?? true,
  }
}

/**
 * Constructs a hidden input field configuration object with a default value.
 * This function creates a configuration for hidden input fields that are initialized
 * with a static or computed default value.
 *
 * @param {Omit<HiddenInputField, 'type' | 'component' | 'children' | 'title'>} data
 * - `id`: Unique identifier for the hidden input field.
 * - `defaultValue`: The default value for the hidden input field. This can be a static value
 * or a function that computes the value based on the application state or other criteria.
 */
export const buildHiddenInput = (
  data: Omit<HiddenInputField, 'type' | 'component' | 'children' | 'title'>,
): HiddenInputField => {
  return {
    ...extractCommonFields({ title: '', ...data }),
    id: data.id,
    type: FieldTypes.HIDDEN_INPUT,
    component: FieldComponents.HIDDEN_INPUT,
    title: '',
    children: undefined,
    defaultValue: data.defaultValue,
    dontDefaultToEmptyString: data.dontDefaultToEmptyString,
    doesNotRequireAnswer: data.doesNotRequireAnswer ?? true,
  }
}

export const buildNationalIdWithNameField = (
  data: Omit<NationalIdWithNameField, 'type' | 'component' | 'children'>,
): NationalIdWithNameField => {
  const {
    disabled,
    required,
    customNationalIdLabel,
    customNameLabel,
    onNationalIdChange,
    onNameChange,
    nationalIdDefaultValue,
    nameDefaultValue,
    errorMessage,
    minAgePerson,
    searchPersons,
    searchCompanies,
    showPhoneField,
    showEmailField,
    phoneRequired,
    emailRequired,
    phoneLabel,
    emailLabel,
    titleVariant,
    description,
    readOnly,
  } = data
  return {
    ...extractCommonFields(data),
    disabled,
    required,
    customNationalIdLabel,
    customNameLabel,
    onNationalIdChange,
    onNameChange,
    nationalIdDefaultValue,
    nameDefaultValue,
    errorMessage,
    minAgePerson,
    searchPersons,
    searchCompanies,
    showPhoneField,
    showEmailField,
    phoneRequired,
    emailRequired,
    phoneLabel,
    emailLabel,
    children: undefined,
    type: FieldTypes.NATIONAL_ID_WITH_NAME,
    component: FieldComponents.NATIONAL_ID_WITH_NAME,
    titleVariant,
    description,
    readOnly,
  }
}

export const buildActionCardListField = (
  data: Omit<ActionCardListField, 'type' | 'component' | 'children'>,
): ActionCardListField => {
  const { items, space } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    type: FieldTypes.ACTION_CARD_LIST,
    component: FieldComponents.ACTION_CARD_LIST,
    items,
    space,
  }
}

export const buildTableRepeaterField = (
  data: Omit<TableRepeaterField, 'type' | 'component' | 'children'>,
): TableRepeaterField => {
  const {
    fields,
    table,
    formTitle,
    titleVariant,
    addItemButtonText,
    saveItemButtonText,
    removeButtonTooltipText,
    editButtonTooltipText,
    editField,
    getStaticTableData,
    maxRows,
    onSubmitLoad,
    loadErrorMessage,
    initActiveFieldIfEmpty,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    type: FieldTypes.TABLE_REPEATER,
    component: FieldComponents.TABLE_REPEATER,
    fields,
    table,
    formTitle,
    titleVariant,
    addItemButtonText,
    saveItemButtonText,
    removeButtonTooltipText,
    editButtonTooltipText,
    editField,
    getStaticTableData,
    maxRows,
    onSubmitLoad,
    loadErrorMessage,
    initActiveFieldIfEmpty,
  }
}

export const buildFieldsRepeaterField = (
  data: Omit<FieldsRepeaterField, 'type' | 'component' | 'children'>,
): FieldsRepeaterField => {
  const {
    fields,
    titleVariant,
    formTitle,
    formTitleVariant,
    formTitleNumbering,
    removeItemButtonText,
    addItemButtonText,
    saveItemButtonText,
    hideAddButton,
    hideRemoveButton,
    displayTitleAsAccordion,
    itemCondition,
    minRows,
    maxRows,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    type: FieldTypes.FIELDS_REPEATER,
    component: FieldComponents.FIELDS_REPEATER,
    fields,
    titleVariant,
    formTitle,
    formTitleVariant,
    formTitleNumbering,
    removeItemButtonText,
    addItemButtonText,
    saveItemButtonText,
    hideAddButton,
    hideRemoveButton,
    displayTitleAsAccordion,
    itemCondition,
    minRows,
    maxRows,
  }
}

export const buildStaticTableField = (
  data: Omit<
    StaticTableField,
    | 'type'
    | 'component'
    | 'children'
    | 'id'
    | 'doesNotRequireAnswer'
    | 'colSpan'
    | 'defaultValue'
    | 'disabled'
    | 'width'
  >,
): StaticTableField => {
  const {
    header,
    condition,
    dataTestId,
    title = '',
    description,
    rows,
    summary,
    marginBottom,
    marginTop = 2,
    titleVariant = 'h4',
  } = data

  return {
    id: '',
    title,
    width: 'full',
    doesNotRequireAnswer: true,
    condition,
    description,
    dataTestId,
    children: undefined,
    type: FieldTypes.STATIC_TABLE,
    component: FieldComponents.STATIC_TABLE,
    header,
    rows,
    summary,
    marginTop,
    marginBottom,
    titleVariant,
  }
}

export const buildSliderField = (
  data: Omit<SliderField, 'type' | 'component' | 'children'>,
): SliderField => {
  const {
    id,
    title = '',
    titleVariant = 'h2',
    condition,
    min = 0,
    max = 10,
    step = 1,
    snap = true,
    trackStyle,
    calculateCellStyle,
    showRemainderOverlay = true,
    showProgressOverlay = true,
    showToolTip = false,
    label,
    showLabel = false,
    showMinMaxLabels = false,
    rangeDates,
    currentIndex,
    onChange,
    onChangeEnd,
    labelMultiplier = 1,
    saveAsString,
    textColor,
    progressOverlayColor,
    marginTop,
    marginBottom,
  } = data
  return {
    component: FieldComponents.SLIDER,
    id,
    title,
    titleVariant,
    condition,
    children: undefined,
    type: FieldTypes.SLIDER,
    min,
    max,
    step,
    snap,
    trackStyle,
    calculateCellStyle,
    showLabel,
    showMinMaxLabels,
    showRemainderOverlay,
    showProgressOverlay,
    showToolTip,
    label,
    rangeDates,
    currentIndex,
    onChange,
    onChangeEnd,
    labelMultiplier,
    saveAsString,
    textColor,
    progressOverlayColor,
    marginTop,
    marginBottom,
  }
}

export const buildInformationFormField = (data: {
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
  items: MaybeWithApplicationAndFieldAndLocale<
    Array<{ label: FormText; value: FormText | FormTextArray }>
  >
  paddingX?: BoxProps['padding']
  paddingY?: BoxProps['padding']
}): InformationCardField => {
  const { condition, width = 'full', colSpan, paddingX, paddingY, items } = data

  return {
    id: '',
    title: '',
    children: undefined,
    doesNotRequireAnswer: true,
    condition,
    width,
    colSpan,
    type: FieldTypes.INFORMATION_CARD,
    component: FieldComponents.INFORMATION_CARD,
    items,
    paddingX,
    paddingY,
  }
}
export const buildDisplayField = (
  data: Omit<DisplayField, 'type' | 'component' | 'children'>,
): DisplayField => {
  const {
    titleVariant,
    label,
    variant,
    value,
    suffix,
    rightAlign,
    halfWidthOwnline,
  } = data
  return {
    ...extractCommonFields(data),
    titleVariant,
    label,
    variant,
    type: FieldTypes.DISPLAY,
    component: FieldComponents.DISPLAY,
    children: undefined,
    value,
    suffix,
    rightAlign,
    halfWidthOwnline,
  }
}

export const buildAccordionField = (
  data: Omit<AccordionField, 'type' | 'component' | 'children'>,
): AccordionField => {
  const {
    accordionItems,
    title = '',
    titleVariant,
    id,
    marginTop,
    marginBottom,
    condition,
  } = data
  return {
    children: undefined,
    id,
    title,
    titleVariant,
    marginTop,
    marginBottom,
    accordionItems,
    condition,
    type: FieldTypes.ACCORDION,
    component: FieldComponents.ACCORDION,
  }
}
export const buildBankAccountField = (
  data: Omit<BankAccountField, 'type' | 'component' | 'children'>,
): BankAccountField => {
  const {
    title = '',
    id,
    marginBottom,
    marginTop,
    titleVariant,
    required,
    defaultValue,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    id,
    title,
    marginBottom,
    marginTop,
    titleVariant,
    required,
    type: FieldTypes.BANK_ACCOUNT,
    component: FieldComponents.BANK_ACCOUNT,
    defaultValue,
  }
}

export const buildOverviewField = (
  data: Omit<OverviewField, 'type' | 'component' | 'children'>,
): OverviewField => {
  const {
    id,
    title,
    titleVariant,
    description,
    backId,
    items,
    loadItems,
    attachments,
    tableData,
    loadTableData,
    bottomLine,
    hideIfEmpty,
    displayTitleAsAccordion,
  } = data
  return {
    ...extractCommonFields(data),
    id,
    title,
    titleVariant,
    description,
    backId,
    items,
    loadItems,
    attachments,
    tableData,
    loadTableData,
    bottomLine,
    hideIfEmpty,
    displayTitleAsAccordion,
    type: FieldTypes.OVERVIEW,
    component: FieldComponents.OVERVIEW,
    children: undefined,
  }
}

export const buildCopyLinkField = (
  data: Omit<CopyLinkField, 'type' | 'component' | 'children'>,
): CopyLinkField => {
  const { id, title, link, buttonTitle, semiBoldLink } = data
  return {
    ...extractCommonFields(data),
    id,
    title,
    link,
    buttonTitle,
    semiBoldLink,
    type: FieldTypes.COPY_LINK,
    component: FieldComponents.COPY_LINK,
    children: undefined,
  }
}

export const buildVehiclePermnoWithInfoField = (
  data: Omit<VehiclePermnoWithInfoField, 'type' | 'component' | 'children'>,
): VehiclePermnoWithInfoField => {
  const {
    required,
    loadValidation,
    permnoLabel,
    makeAndColorLabel,
    errorTitle,
    fallbackErrorMessage,
    validationFailedErrorMessage,
    isTrailer,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    type: FieldTypes.VEHICLE_PERMNO_WITH_INFO,
    component: FieldComponents.VEHICLE_PERMNO_WITH_INFO,
    required,
    loadValidation,
    permnoLabel,
    makeAndColorLabel,
    errorTitle,
    fallbackErrorMessage,
    validationFailedErrorMessage,
    isTrailer,
  }
}
