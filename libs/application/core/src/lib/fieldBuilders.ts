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
  MaybeWithApplicationAndField,
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
} from '@island.is/application/types'

import { Colors } from '@island.is/island-ui/theme'
import { SpanType } from '@island.is/island-ui/core/types'
import { coreDefaultFieldMessages } from './messages'

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
    title,
    dataTestId,
    width = 'full',
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
  }
}

export function buildCheckboxField(
  data: Omit<CheckboxField, 'type' | 'component' | 'children'>,
): CheckboxField {
  const {
    options,
    strong = false,
    large = true,
    required,
    backgroundColor = 'blue',
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    large,
    strong,
    backgroundColor,
    options,
    required,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(
  data: Omit<DateField, 'type' | 'component' | 'children'>,
): DateField {
  const {
    maxDate,
    minDate,
    excludeDates,
    placeholder,
    backgroundColor = 'blue',
    required,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    maxDate,
    minDate,
    excludeDates,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
    backgroundColor,
    required,
  }
}

export function buildDescriptionField(
  data: Omit<DescriptionField, 'type' | 'component' | 'children'>,
): DescriptionField {
  const {
    titleVariant = 'h2',
    description,
    tooltip,
    titleTooltip,
    space,
    marginBottom,
  } = data
  return {
    ...extractCommonFields(data),
    doesNotRequireAnswer: true,
    children: undefined,
    description,
    titleVariant,
    tooltip,
    titleTooltip,
    space,
    marginBottom,
    type: FieldTypes.DESCRIPTION,
    component: FieldComponents.DESCRIPTION,
  }
}

export function buildRadioField(
  data: Omit<RadioField, 'type' | 'component' | 'children'>,
): RadioField {
  const {
    options,
    largeButtons = true,
    backgroundColor,
    space,
    required,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    largeButtons,
    options,
    backgroundColor,
    space,
    required,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(
  data: Omit<SelectField, 'type' | 'component' | 'children'>,
): SelectField {
  const {
    options,
    placeholder,
    onSelect,
    backgroundColor = 'blue',
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
    backgroundColor,
  }
}

export function buildAsyncSelectField(
  data: Omit<AsyncSelectField, 'type' | 'component' | 'children'>,
): AsyncSelectField {
  const {
    loadOptions,
    loadingError,
    placeholder,
    onSelect,
    backgroundColor = 'blue',
    isSearchable,
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
  }
}

export function buildCompanySearchField(
  data: Omit<CompanySearchField, 'type' | 'component' | 'children'>,
): CompanySearchField {
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

export function buildTextField(
  data: Omit<TextField, 'type' | 'component' | 'children'>,
): TextField {
  const {
    backgroundColor = 'blue',
    placeholder,
    variant = 'text',
    format,
    suffix,
    rows,
    required,
    maxLength,
    readOnly,
    rightAlign,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    backgroundColor,
    variant,
    format,
    suffix,
    rows,
    required,
    maxLength,
    readOnly,
    rightAlign,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildPhoneField(
  data: Omit<PhoneField, 'type' | 'component' | 'children'>,
): PhoneField {
  const {
    backgroundColor = 'blue',
    placeholder,
    required,
    readOnly,
    rightAlign,
    allowedCountryCodes,
    disableDropdown,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    backgroundColor,
    required,
    readOnly,
    allowedCountryCodes,
    disableDropdown,
    rightAlign,
    type: FieldTypes.PHONE,
    component: FieldComponents.PHONE,
  }
}

export function buildCustomField(
  data: Omit<CustomField, 'props' | 'type' | 'children'>,
  props?: RecordObject,
): CustomField {
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

export function buildFileUploadField(
  data: Omit<FileUploadField, 'type' | 'component' | 'children'>,
): FileUploadField {
  const {
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
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
    uploadAccept:
      uploadAccept ?? '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
    maxSize: maxSize ?? 10000000,
    maxSizeErrorText,
    forImageUpload,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: {
  condition?: Condition
  title?: FormText
  color?: Colors
}): DividerField {
  const { title, color, condition } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    doesNotRequireAnswer: true,
    title: title ?? '',
    color,
    condition,
  }
}

export function buildKeyValueField(data: {
  label: FormText
  value: FormText | FormTextArray
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
  display?: 'block' | 'flex'
}): KeyValueField {
  const {
    label,
    value,
    condition,
    width = 'full',
    colSpan,
    display = 'block',
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
    type: FieldTypes.KEY_VALUE,
    component: FieldComponents.KEY_VALUE,
    display,
  }
}

export function buildSubmitField(data: {
  id: string
  title: FormText
  placement?: 'footer' | 'screen'
  refetchApplicationAfterSubmit?: boolean
  actions: CallToAction[]
}): SubmitField {
  const {
    id,
    placement = 'footer',
    title,
    actions,
    refetchApplicationAfterSubmit,
  } = data
  return {
    children: undefined,
    id,
    title,
    actions,
    placement,
    doesNotRequireAnswer: true,
    refetchApplicationAfterSubmit:
      typeof refetchApplicationAfterSubmit !== 'undefined'
        ? refetchApplicationAfterSubmit
        : false,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}

export function buildFieldOptions(
  maybeOptions: MaybeWithApplicationAndField<Option[]>,
  application: Application,
  field: Field,
): Option[] {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application, field)
  }

  return maybeOptions
}

export function buildRedirectToServicePortalField(data: {
  id: string
  title: FormText
}): RedirectToServicePortalField {
  const { id, title } = data
  return {
    children: undefined,
    id,
    title,
    type: FieldTypes.REDIRECT_TO_SERVICE_PORTAL,
    component: FieldComponents.REDIRECT_TO_SERVICE_PORTAL,
  }
}

export function buildPaymentPendingField(data: {
  id: string
  title: FormText
}): PaymentPendingField {
  const { id, title } = data
  return {
    children: undefined,
    id,
    title,
    type: FieldTypes.PAYMENT_PENDING,
    component: FieldComponents.PAYMENT_PENDING,
  }
}

export function buildMessageWithLinkButtonField(
  data: Omit<MessageWithLinkButtonField, 'type' | 'component' | 'children'>,
): MessageWithLinkButtonField {
  const { id, title, url, message, buttonTitle } = data
  return {
    children: undefined,
    id,
    title,
    url,
    message,
    buttonTitle,
    type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
    component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
  }
}

export function buildExpandableDescriptionField(
  data: Omit<ExpandableDescriptionField, 'type' | 'component' | 'children'>,
): ExpandableDescriptionField {
  const { id, title, description, introText, startExpanded, condition } = data
  return {
    children: undefined,
    id,
    title,
    description,
    introText,
    startExpanded,
    condition,
    type: FieldTypes.EXPANDABLE_DESCRIPTION,
    component: FieldComponents.EXPANDABLE_DESCRIPTION,
  }
}
export function buildAlertMessageField(
  data: Omit<AlertMessageField, 'type' | 'component' | 'children'>,
): AlertMessageField {
  const {
    id,
    title,
    message,
    alertType,
    condition,
    marginTop,
    marginBottom,
    links,
  } = data
  return {
    children: undefined,
    id,
    title,
    message,
    alertType,
    condition,
    type: FieldTypes.ALERT_MESSAGE,
    component: FieldComponents.ALERT_MESSAGE,
    marginTop,
    marginBottom,
    links,
  }
}

export function buildLinkField(
  data: Omit<LinkField, 'type' | 'component' | 'children'>,
): LinkField {
  const { s3key, link, iconProps } = data
  return {
    ...extractCommonFields(data),
    s3key,
    link,
    iconProps,
    children: undefined,
    type: FieldTypes.LINK,
    component: FieldComponents.LINK,
  }
}

export function buildPaymentChargeOverviewField(
  data: Omit<PaymentChargeOverviewField, 'type' | 'component' | 'children'>,
): PaymentChargeOverviewField {
  const { id, title, forPaymentLabel, totalLabel, getSelectedChargeItems } =
    data
  return {
    children: undefined,
    id,
    title,
    forPaymentLabel,
    totalLabel,
    getSelectedChargeItems,
    type: FieldTypes.PAYMENT_CHARGE_OVERVIEW,
    component: FieldComponents.PAYMENT_CHARGE_OVERVIEW,
  }
}

export function buildPdfLinkButtonField(
  data: Omit<PdfLinkButtonField, 'type' | 'component' | 'children'>,
): PdfLinkButtonField {
  const {
    downloadButtonTitle,
    verificationDescription,
    verificationLinkTitle,
    verificationLinkUrl,
    getPdfFiles,
    // isViewingFile,
    // setIsViewingFile,
  } = data
  return {
    ...extractCommonFields(data),
    downloadButtonTitle,
    verificationDescription,
    verificationLinkTitle,
    verificationLinkUrl,
    getPdfFiles,
    // isViewingFile,
    // setIsViewingFile,
    children: undefined,
    type: FieldTypes.PDF_LINK_BUTTON,
    component: FieldComponents.PDF_LINK_BUTTON,
  }
}
