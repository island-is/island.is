import type {
  ActionCardProps,
  BoxProps,
  DatePickerBackgroundColor,
  DatePickerProps,
  IconProps,
  InputBackgroundColor,
  ResponsiveProp,
  SpanType,
} from '@island.is/island-ui/core/types'
import {
  FormItem,
  FormText,
  FormTextArray,
  FormTextWithLocale,
  StaticText,
} from './Form'
import { ApolloClient } from '@apollo/client'
import { Application, FormValue } from './Application'
import { CallToAction } from './StateMachine'
import { Colors, theme } from '@island.is/island-ui/theme'
import { Condition } from './Condition'
import { FormatInputValueFunction } from 'react-number-format'
import React, { CSSProperties } from 'react'
import { TestSupport } from '@island.is/island-ui/utils'
import { MessageDescriptor } from 'react-intl'
import { Locale } from '@island.is/shared/types'

export type RecordObject<T = unknown> = Record<string, T>
export type MaybeWithApplication<T> = T | ((application: Application) => T)
export type MaybeWithApplicationAndField<T> =
  | T
  | ((application: Application, field: Field) => T)
export type MaybeWithApplicationAndFieldAndLocale<T> =
  | T
  | ((application: Application, field: Field, locale: Locale) => T)
export type ValidAnswers = 'yes' | 'no' | undefined
export type FieldWidth = 'full' | 'half'
export type TitleVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
export type TextFieldVariant =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'textarea'
  | 'currency'

export type Context = {
  application: Application
  apolloClient: ApolloClient<object>
}

export type AsyncSelectContext = {
  application: Application
  apolloClient: ApolloClient<object>
  selectedValue?: string | string[]
}

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'rose'
  | 'blueberry'
  | 'dark'
  | 'mint'
  | 'disabled'

export type RepeaterFields =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'nationalIdWithName'
  | 'phone'

type RepeaterOption = { label: StaticText; value: string; tooltip?: StaticText }

type TableRepeaterOptions =
  | RepeaterOption[]
  | ((
      application: Application,
      activeField?: Record<string, string>,
    ) => RepeaterOption[] | [])

export type RepeaterItem = {
  component: RepeaterFields
  /**
   * Defaults to true
   */
  displayInTable?: boolean
  label?: StaticText
  phoneLabel?: StaticText
  emailLabel?: StaticText
  placeholder?: StaticText
  options?: TableRepeaterOptions
  backgroundColor?: 'blue' | 'white'
  width?: 'half' | 'full' | 'third'
  required?: boolean
  condition?: (
    application: Application,
    activeField?: Record<string, string>,
  ) => boolean
  dataTestId?: string
  showPhoneField?: boolean
  phoneRequired?: boolean
  showEmailField?: boolean
  emailRequired?: boolean
  searchCompanies?: boolean
  searchPersons?: boolean
  readonly?:
    | boolean
    | ((
        application: Application,
        activeField?: Record<string, string>,
      ) => boolean)
  disabled?:
    | boolean
    | ((
        application: Application,
        activeField?: Record<string, string>,
      ) => boolean)
  updateValueObj?: {
    valueModifier: (
      application: Application,
      activeField?: Record<string, string>,
    ) => unknown
    watchValues:
      | string
      | string[]
      | ((
          activeField?: Record<string, string>,
        ) => string | string[] | undefined)
  }
  defaultValue?: (
    application: Application,
    activeField?: Record<string, string>,
  ) => unknown
} & (
  | {
      component: 'input'
      label: StaticText
      type?: 'text' | 'number' | 'email' | 'tel'
      format?: string
      textarea?: boolean
      rows?: number
      maxLength?: number
      currency?: boolean
      suffix?: string
    }
  | {
      component: 'phone'
      allowedCountryCodes?: string[]
      enableCountrySelector?: boolean
    }
  | {
      component: 'date'
      label: StaticText
      locale?: Locale
      maxDate?: DatePickerProps['maxDate']
      minDate?: DatePickerProps['minDate']
      minYear?: number
      maxYear?: number
      excludeDates?: DatePickerProps['excludeDates']
    }
  | {
      component: 'select'
      label: StaticText
      isSearchable?: boolean
      isMulti?: boolean
    }
  | {
      component: 'radio'
      largeButtons?: boolean
    }
  | {
      component: 'checkbox'
      large?: boolean
    }
  | {
      component: 'nationalIdWithName'
    }
  | {
      component: 'phone'
      format: string
    }
)

export type AlertMessageLink = {
  title: MessageDescriptor | string
  url: MessageDescriptor | string
  isExternal: boolean
}
export interface Option extends TestSupport {
  value: string
  label: FormText
  subLabel?: FormText
  tooltip?: FormText
  excludeOthers?: boolean
  illustration?: React.FC<React.PropsWithChildren<unknown>>
  rightContent?: React.ReactNode
  disabled?: boolean
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
}

export interface SelectOption<T = string | number> {
  label: string
  value: T
}

export interface BaseField extends FormItem {
  readonly id: string
  readonly component: FieldComponents | string
  readonly title?: FormTextWithLocale
  readonly description?: FormTextWithLocale
  readonly children: undefined
  disabled?: boolean
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
  isPartOfRepeater?: boolean
  defaultValue?: MaybeWithApplicationAndField<unknown>
  doesNotRequireAnswer?: boolean
  marginBottom?: BoxProps['marginBottom']
  marginTop?: BoxProps['marginTop']
  clearOnChange?: string[]

  // TODO use something like this for non-schema validation?
  // validate?: (formValue: FormValue, context?: object) => boolean
}

export interface InputField extends BaseField {
  required?: MaybeWithApplication<boolean>
}

export enum FieldTypes {
  CHECKBOX = 'CHECKBOX',
  CUSTOM = 'CUSTOM',
  DATE = 'DATE',
  DESCRIPTION = 'DESCRIPTION',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  FILEUPLOAD = 'FILEUPLOAD',
  SUBMIT = 'SUBMIT',
  DIVIDER = 'DIVIDER',
  KEY_VALUE = 'KEY_VALUE',
  ASYNC_SELECT = 'ASYNC_SELECT',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPANY_SEARCH = 'COMPANY_SEARCH',
  REDIRECT_TO_SERVICE_PORTAL = 'REDIRECT_TO_SERVICE_PORTAL',
  PHONE = 'PHONE',
  MESSAGE_WITH_LINK_BUTTON_FIELD = 'MESSAGE_WITH_LINK_BUTTON_FIELD',
  EXPANDABLE_DESCRIPTION = 'EXPANDABLE_DESCRIPTION',
  ALERT_MESSAGE = 'ALERT_MESSAGE',
  LINK = 'LINK',
  PAYMENT_CHARGE_OVERVIEW = 'PAYMENT_CHARGE_OVERVIEW',
  IMAGE = 'IMAGE',
  PDF_LINK_BUTTON = 'PDF_LINK_BUTTON',
  NATIONAL_ID_WITH_NAME = 'NATIONAL_ID_WITH_NAME',
  ACTION_CARD_LIST = 'ACTION_CARD_LIST',
  TABLE_REPEATER = 'TABLE_REPEATER',
  FIELDS_REPEATER = 'FIELDS_REPEATER',
  HIDDEN_INPUT = 'HIDDEN_INPUT',
  HIDDEN_INPUT_WITH_WATCHED_VALUE = 'HIDDEN_INPUT_WITH_WATCHED_VALUE',
  FIND_VEHICLE = 'FIND_VEHICLE',
  VEHICLE_RADIO = 'VEHICLE_RADIO',
  STATIC_TABLE = 'STATIC_TABLE',
  SLIDER = 'SLIDER',
  DISPLAY = 'DISPLAY',
  ACCORDION = 'ACCORDION',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  TITLE = 'TITLE',
}

export enum FieldComponents {
  CHECKBOX = 'CheckboxFormField',
  DATE = 'DateFormField',
  TEXT = 'TextFormField',
  DESCRIPTION = 'DescriptionFormField',
  RADIO = 'RadioFormField',
  SELECT = 'SelectFormField',
  FILEUPLOAD = 'FileUploadFormField',
  DIVIDER = 'DividerFormField',
  KEY_VALUE = 'KeyValueFormField',
  SUBMIT = 'SubmitFormField',
  ASYNC_SELECT = 'AsyncSelectFormField',
  COMPANY_SEARCH = 'CompanySearchFormField',
  REDIRECT_TO_SERVICE_PORTAL = 'RedirectToServicePortalFormField',
  PAYMENT_PENDING = 'PaymentPendingFormField',
  PHONE = 'PhoneFormField',
  MESSAGE_WITH_LINK_BUTTON_FIELD = 'MessageWithLinkButtonFormField',
  EXPANDABLE_DESCRIPTION = 'ExpandableDescriptionFormField',
  ALERT_MESSAGE = 'AlertMessageFormField',
  LINK = 'LinkFormField',
  PAYMENT_CHARGE_OVERVIEW = 'PaymentChargeOverviewFormField',
  IMAGE = 'ImageFormField',
  PDF_LINK_BUTTON = 'PdfLinkButtonFormField',
  NATIONAL_ID_WITH_NAME = 'NationalIdWithNameFormField',
  ACTION_CARD_LIST = 'ActionCardListFormField',
  TABLE_REPEATER = 'TableRepeaterFormField',
  FIELDS_REPEATER = 'FieldsRepeaterFormField',
  HIDDEN_INPUT = 'HiddenInputFormField',
  FIND_VEHICLE = 'FindVehicleFormField',
  VEHICLE_RADIO = 'VehicleRadioFormField',
  STATIC_TABLE = 'StaticTableFormField',
  SLIDER = 'SliderFormField',
  DISPLAY = 'DisplayFormField',
  ACCORDION = 'AccordionFormField',
  BANK_ACCOUNT = 'BankAccountFormField',
  TITLE = 'TitleFormField',
}

export interface CheckboxField extends InputField {
  readonly type: FieldTypes.CHECKBOX
  component: FieldComponents.CHECKBOX
  options: MaybeWithApplicationAndFieldAndLocale<Option[]>
  large?: boolean
  strong?: boolean
  backgroundColor?: InputBackgroundColor
  onSelect?: ((s: string[]) => void) | undefined
  spacing?: 0 | 1 | 2
}

export interface DateField extends InputField {
  readonly type: FieldTypes.DATE
  placeholder?: FormText
  component: FieldComponents.DATE
  maxDate?: MaybeWithApplicationAndField<Date>
  minDate?: MaybeWithApplicationAndField<Date>
  minYear?: number
  maxYear?: number
  excludeDates?: MaybeWithApplicationAndField<Date[]>
  backgroundColor?: DatePickerBackgroundColor
  onChange?(date: string): void
  readOnly?: boolean
}

export interface DescriptionField extends BaseField {
  readonly type: FieldTypes.DESCRIPTION
  component: FieldComponents.DESCRIPTION
  readonly description?: FormText
  tooltip?: FormText
  titleTooltip?: FormText
  space?: BoxProps['paddingTop']
  titleVariant?: TitleVariants
}

export interface RadioField extends InputField {
  readonly type: FieldTypes.RADIO
  component: FieldComponents.RADIO
  options: MaybeWithApplicationAndFieldAndLocale<Option[]>
  backgroundColor?: InputBackgroundColor
  largeButtons?: boolean
  space?: BoxProps['paddingTop']
  hasIllustration?: boolean
  widthWithIllustration?: '1/1' | '1/2' | '1/3'
  onSelect?(s: string): void
}

export interface SelectField extends InputField {
  readonly type: FieldTypes.SELECT
  component: FieldComponents.SELECT
  options: MaybeWithApplicationAndFieldAndLocale<Option[]>
  onSelect?(s: SelectOption, cb: (t: unknown) => void): void
  placeholder?: FormText
  backgroundColor?: InputBackgroundColor
  isMulti?: boolean
  isClearable?: boolean
}

export interface CompanySearchField extends InputField {
  readonly type: FieldTypes.COMPANY_SEARCH
  component: FieldComponents.COMPANY_SEARCH
  placeholder?: FormText
  setLabelToDataSchema?: boolean
  shouldIncludeIsatNumber?: boolean
  checkIfEmployerIsOnForbiddenList?: boolean
}

export interface AsyncSelectField extends InputField {
  readonly type: FieldTypes.ASYNC_SELECT
  component: FieldComponents.ASYNC_SELECT
  placeholder?: FormText
  loadOptions(c: AsyncSelectContext): Promise<Option[]>
  onSelect?(s: SelectOption, cb: (t: unknown) => void): void
  loadingError?: FormText
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
  isMulti?: boolean
  updateOnSelect?: string
}

export interface TextField extends InputField {
  readonly type: FieldTypes.TEXT
  component: FieldComponents.TEXT
  disabled?: boolean
  readOnly?: boolean
  rightAlign?: boolean
  minLength?: number
  maxLength?: number
  max?: number
  min?: number
  step?: string
  placeholder?: FormText
  variant?: TextFieldVariant
  backgroundColor?: InputBackgroundColor
  format?: string | FormatInputValueFunction
  suffix?: string
  rows?: number
  tooltip?: FormText
  onChange?: (...event: any[]) => void
}

export interface PhoneField extends InputField {
  readonly type: FieldTypes.PHONE
  component: FieldComponents.PHONE
  disabled?: boolean
  readOnly?: boolean
  rightAlign?: boolean
  placeholder?: FormText
  backgroundColor?: InputBackgroundColor
  allowedCountryCodes?: string[]
  enableCountrySelector?: boolean
  onChange?: (...event: any[]) => void
}

export interface FileUploadField extends BaseField {
  readonly type: FieldTypes.FILEUPLOAD
  component: FieldComponents.FILEUPLOAD
  readonly introduction?: FormText
  readonly uploadHeader?: FormText
  readonly uploadDescription?: FormText
  readonly uploadButtonLabel?: FormText
  readonly uploadMultiple?: boolean
  /**
   * Defaults to '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic'
   */
  readonly uploadAccept?: string
  /**
   * Defaults to 10MB
   */
  readonly maxSize?: number
  readonly maxSizeErrorText?: FormText
  /**
   * Defaults to 100MB
   */
  readonly totalMaxSize?: number
  readonly forImageUpload?: boolean
}

export interface SubmitField extends BaseField {
  readonly type: FieldTypes.SUBMIT
  component: FieldComponents.SUBMIT
  readonly actions: CallToAction[]
  readonly placement: 'footer' | 'screen'
  readonly refetchApplicationAfterSubmit?: boolean
}

export interface DividerField extends BaseField {
  readonly type: FieldTypes.DIVIDER
  useDividerLine?: boolean
  component: FieldComponents.DIVIDER
}

export interface TitleField extends BaseField {
  readonly type: FieldTypes.TITLE
  readonly color?: Colors
  titleVariant?: TitleVariants
  component: FieldComponents.TITLE
}

export interface KeyValueField extends BaseField {
  readonly type: FieldTypes.KEY_VALUE
  label: FormText
  value: FormText | FormTextArray
  component: FieldComponents.KEY_VALUE
  display?: 'block' | 'flex'
  divider?: boolean
  paddingX?: BoxProps['padding']
  paddingY?: BoxProps['padding']
  paddingBottom?: BoxProps['padding']
}

export interface CustomField extends BaseField {
  readonly type: FieldTypes.CUSTOM
  readonly component: string
  props?: RecordObject
  childInputIds?: string[]
}

export interface RedirectToServicePortalField extends BaseField {
  readonly type: FieldTypes.REDIRECT_TO_SERVICE_PORTAL
  component: FieldComponents.REDIRECT_TO_SERVICE_PORTAL
}

export interface PaymentPendingField extends BaseField {
  readonly type: FieldTypes.PAYMENT_PENDING
  component: FieldComponents.PAYMENT_PENDING
}

export interface MessageWithLinkButtonField extends BaseField {
  readonly type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD
  component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD
  url: string
  buttonTitle: FormText
  message: FormText
}

export interface ExpandableDescriptionField extends BaseField {
  readonly type: FieldTypes.EXPANDABLE_DESCRIPTION
  component: FieldComponents.EXPANDABLE_DESCRIPTION
  introText?: FormText
  description: FormText
  startExpanded?: boolean
}

export interface AlertMessageField extends BaseField {
  readonly type: FieldTypes.ALERT_MESSAGE
  component: FieldComponents.ALERT_MESSAGE
  alertType?: 'default' | 'warning' | 'error' | 'info' | 'success'
  message?: FormText
  links?: AlertMessageLink[]
}

export interface LinkField extends BaseField {
  readonly type: FieldTypes.LINK
  component: FieldComponents.LINK
  s3key?: FormText
  link?: FormText
  iconProps?: Pick<IconProps, 'icon' | 'type'>
}

export interface PaymentChargeOverviewField extends BaseField {
  readonly type: FieldTypes.PAYMENT_CHARGE_OVERVIEW
  component: FieldComponents.PAYMENT_CHARGE_OVERVIEW
  forPaymentLabel: StaticText
  totalLabel: StaticText
  getSelectedChargeItems: (application: Application) => {
    chargeItemCode: string
    chargeItemQuantity?: number
    extraLabel?: StaticText
  }[]
}

type ImageWidthProps = 'full' | 'auto' | '50%'
type ImagePositionProps = 'left' | 'right' | 'center'

export interface ImageField extends BaseField {
  readonly type: FieldTypes.IMAGE
  component: FieldComponents.IMAGE
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string
  alt?: string
  titleVariant?: TitleVariants
  imageWidth?: ImageWidthProps | Array<ImageWidthProps>
  imagePosition?: ImagePositionProps | Array<ImagePositionProps>
}

export interface PdfLinkButtonField extends BaseField {
  readonly type: FieldTypes.PDF_LINK_BUTTON
  component: FieldComponents.PDF_LINK_BUTTON
  verificationDescription: StaticText
  verificationLinkTitle: StaticText
  verificationLinkUrl: StaticText
  getPdfFiles?: (application: Application) => {
    base64: string
    buttonText?: StaticText
    customButtonText?: { is: string; en: string }
    filename: string
  }[]
  setViewPdfFile?: (file: { base64: string; filename: string }) => void
  viewPdfFile?: boolean
  downloadButtonTitle?: StaticText
}

export interface NationalIdWithNameField extends InputField {
  readonly type: FieldTypes.NATIONAL_ID_WITH_NAME
  component: FieldComponents.NATIONAL_ID_WITH_NAME
  disabled?: boolean
  customNationalIdLabel?: StaticText
  customNameLabel?: StaticText
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  errorMessage?: string
  minAgePerson?: number
  searchPersons?: boolean
  searchCompanies?: boolean
  showPhoneField?: boolean
  showEmailField?: boolean
  phoneRequired?: boolean
  emailRequired?: boolean
  phoneLabel?: StaticText
  emailLabel?: StaticText
  titleVariant?: TitleVariants
}

type Modify<T, R> = Omit<T, keyof R> & R

export type ActionCardListField = BaseField & {
  readonly type: FieldTypes.ACTION_CARD_LIST
  component: FieldComponents.ACTION_CARD_LIST
  items: (
    application: Application,
    lang: Locale,
  ) => ApplicationActionCardProps[]
  space?: BoxProps['paddingTop']
}

export type ApplicationActionCardProps = Modify<
  ActionCardProps,
  {
    eyebrow?: string
    heading?: FormText
    text?: FormText
    tag?: Modify<ActionCardProps['tag'], { label: FormText }>
    cta?: Modify<ActionCardProps['cta'], { label: FormText }>
    unavailable?: Modify<
      ActionCardProps['unavailable'],
      { label?: FormText; message?: FormText }
    >
  }
>

export type TableRepeaterField = BaseField & {
  readonly type: FieldTypes.TABLE_REPEATER
  component: FieldComponents.TABLE_REPEATER
  formTitle?: StaticText
  addItemButtonText?: StaticText
  cancelButtonText?: StaticText
  saveItemButtonText?: StaticText
  getStaticTableData?: (application: Application) => Record<string, string>[]
  removeButtonTooltipText?: StaticText
  editButtonTooltipText?: StaticText
  editField?: boolean
  titleVariant?: TitleVariants
  fields: Record<string, RepeaterItem>
  /**
   * Maximum rows that can be added to the table.
   * When the maximum is reached, the button to add a new row is disabled.
   */
  maxRows?: number
  table?: {
    /**
     * List of strings to render,
     * if not provided it will be auto generated from the fields
     */
    header?: StaticText[]
    /**
     * List of field id's to render,
     * if not provided it will be auto generated from the fields
     */
    rows?: string[]
    format?: Record<string, (value: string) => string | StaticText>
  }
}

export type FieldsRepeaterField = BaseField & {
  readonly type: FieldTypes.FIELDS_REPEATER
  component: FieldComponents.FIELDS_REPEATER
  titleVariant?: TitleVariants
  formTitle?: StaticText
  formTitleVariant?: TitleVariants
  formTitleNumbering?: 'prefix' | 'suffix' | 'none'
  removeItemButtonText?: StaticText
  addItemButtonText?: StaticText
  saveItemButtonText?: StaticText
  fields: Record<string, RepeaterItem>
  /**
   * Maximum rows that can be added to the table.
   * When the maximum is reached, the button to add a new row is disabled.
   */
  minRows?: number
  maxRows?: number
}

export type AccordionItem = {
  itemTitle: FormText
  itemContent: FormText
}
export interface AccordionField extends BaseField {
  readonly type: FieldTypes.ACCORDION
  component: FieldComponents.ACCORDION
  accordionItems:
    | Array<AccordionItem>
    | ((application: Application) => Array<AccordionItem>)
  titleVariant?: TitleVariants
}
export interface BankAccountField extends BaseField {
  readonly type: FieldTypes.BANK_ACCOUNT
  component: FieldComponents.BANK_ACCOUNT
  titleVariant?: TitleVariants
}

export interface FindVehicleField extends InputField {
  readonly type: FieldTypes.FIND_VEHICLE
  component: FieldComponents.FIND_VEHICLE
  disabled?: boolean
  additionalErrors: boolean
  getDetails?: (plate: string) => Promise<unknown>
  findVehicleButtonText?: FormText
  findPlatePlaceholder?: FormText
  notFoundErrorMessage?: FormText
  notFoundErrorTitle?: FormText
  fallbackErrorMessage?: FormText
  hasErrorTitle?: FormText
  isNotDebtLessTag?: FormText
  validationErrors?: Record<string, FormText>
  requiredValidVehicleErrorMessage?: FormText
  isMachine?: boolean
  isEnergyFunds?: boolean
  energyFundsMessages?: Record<string, FormText>
}

export interface VehicleRadioField extends InputField {
  readonly type: FieldTypes.VEHICLE_RADIO
  component: FieldComponents.VEHICLE_RADIO
  itemType: 'VEHICLE' | 'PLATE'
  itemList: unknown[]
  shouldValidateDebtStatus?: boolean
  shouldValidateRenewal?: boolean
  alertMessageErrorTitle?: FormText
  validationErrorMessages?: Record<string, FormText>
  validationErrorFallbackMessage?: FormText
  inputErrorMessage: FormText
  debtStatusErrorMessage?: FormText
  renewalExpiresAtTag?: StaticText
  validateRenewal?: (item: unknown) => boolean
}

export interface HiddenInputWithWatchedValueField extends BaseField {
  watchValue: string
  type: FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE
  component: FieldComponents.HIDDEN_INPUT
  valueModifier?: (value: unknown) => unknown
}

export interface HiddenInputField extends BaseField {
  watchValue?: never
  type: FieldTypes.HIDDEN_INPUT
  component: FieldComponents.HIDDEN_INPUT
  valueModifier?: never
}

export interface StaticTableField extends BaseField {
  readonly type: FieldTypes.STATIC_TABLE
  component: FieldComponents.STATIC_TABLE
  header: StaticText[] | ((application: Application) => StaticText[])
  rows: StaticText[][] | ((application: Application) => StaticText[][])
  titleVariant?: TitleVariants
  summary?:
    | { label: StaticText; value: StaticText }[]
    | ((application: Application) => { label: StaticText; value: StaticText }[])
}

export interface SliderField extends BaseField {
  readonly type: FieldTypes.SLIDER
  readonly color?: Colors
  component: FieldComponents.SLIDER
  titleVariant?: TitleVariants
  min: number
  max: MaybeWithApplicationAndField<number>
  step?: number
  snap?: boolean
  trackStyle?: CSSProperties
  calculateCellStyle?: (index: number) => CSSProperties
  showLabel?: boolean
  showMinMaxLabels?: boolean
  showRemainderOverlay?: boolean
  showProgressOverlay?: boolean
  showToolTip?: boolean
  label?: {
    singular: FormText
    plural: FormText
  }
  rangeDates?: {
    start: {
      date: string | Date
      message: string
    }
    end: {
      date: string | Date
      message: string
    }
  }
  currentIndex?: number
  onChange?: (index: number) => void
  onChangeEnd?(index: number): void
  labelMultiplier?: number
  id: string
  saveAsString?: boolean
  textColor?: Colors
  progressOverlayColor?: Colors
}

export interface DisplayField extends BaseField {
  readonly type: FieldTypes.DISPLAY
  component: FieldComponents.DISPLAY
  titleVariant?: TitleVariants
  suffix?: MessageDescriptor | string
  rightAlign?: boolean
  halfWidthOwnline?: boolean
  variant?: TextFieldVariant
  label?: MessageDescriptor | string
  value: (answers: FormValue) => string
}

export type Field =
  | CheckboxField
  | CustomField
  | DateField
  | DescriptionField
  | RadioField
  | SelectField
  | TextField
  | FileUploadField
  | KeyValueField
  | DividerField
  | SubmitField
  | AsyncSelectField
  | CompanySearchField
  | RedirectToServicePortalField
  | PaymentPendingField
  | PhoneField
  | MessageWithLinkButtonField
  | ExpandableDescriptionField
  | AlertMessageField
  | LinkField
  | PaymentChargeOverviewField
  | ImageField
  | PdfLinkButtonField
  | NationalIdWithNameField
  | ActionCardListField
  | TableRepeaterField
  | FieldsRepeaterField
  | HiddenInputWithWatchedValueField
  | HiddenInputField
  | FindVehicleField
  | VehicleRadioField
  | StaticTableField
  | SliderField
  | DisplayField
  | AccordionField
  | BankAccountField
  | TitleField
