import type {
  BoxProps,
  DatePickerBackgroundColor,
  IconProps,
  InputBackgroundColor,
  ResponsiveProp,
  SpanType,
} from '@island.is/island-ui/core/types'
import { FormItem, FormText, FormTextArray, StaticText } from './Form'

import { ApolloClient } from '@apollo/client'
import { Application } from './Application'
import { CallToAction } from './StateMachine'
import { Colors, theme } from '@island.is/island-ui/theme'
import { Condition } from './Condition'
import { FormatInputValueFunction } from 'react-number-format'
import React from 'react'
import { TestSupport } from '@island.is/island-ui/utils'
import { MessageDescriptor } from 'react-intl'

type Space = keyof typeof theme.spacing

export type RecordObject<T = unknown> = Record<string, T>
export type MaybeWithApplicationAndField<T> =
  | T
  | ((application: Application, field: Field) => T)
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
  readonly title: FormText
  readonly description?: FormText
  readonly children: undefined
  disabled?: boolean
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
  isPartOfRepeater?: boolean
  defaultValue?: MaybeWithApplicationAndField<unknown>
  doesNotRequireAnswer?: boolean
  // TODO use something like this for non-schema validation?
  // validate?: (formValue: FormValue, context?: object) => boolean
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
  PDF_LINK_BUTTON = 'PDF_LINK_BUTTON',
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
  PDF_LINK_BUTTON = 'PdfLinkButtonFormField',
}

export interface CheckboxField extends BaseField {
  readonly type: FieldTypes.CHECKBOX
  component: FieldComponents.CHECKBOX
  options: MaybeWithApplicationAndField<Option[]>
  large?: boolean
  strong?: boolean
  required?: boolean
  backgroundColor?: InputBackgroundColor
  onSelect?: ((s: string[]) => void) | undefined
}

export interface DateField extends BaseField {
  readonly type: FieldTypes.DATE
  placeholder?: FormText
  component: FieldComponents.DATE
  maxDate?: Date
  minDate?: MaybeWithApplicationAndField<Date>
  excludeDates?: MaybeWithApplicationAndField<Date[]>
  backgroundColor?: DatePickerBackgroundColor
  onChange?(date: string): void
  required?: boolean
}

export interface DescriptionField extends BaseField {
  readonly type: FieldTypes.DESCRIPTION
  component: FieldComponents.DESCRIPTION
  readonly description?: FormText
  tooltip?: FormText
  titleTooltip?: FormText
  space?: BoxProps['paddingTop']
  marginBottom?: BoxProps['marginBottom']
  titleVariant?: TitleVariants
}

export interface RadioField extends BaseField {
  readonly type: FieldTypes.RADIO
  component: FieldComponents.RADIO
  options: MaybeWithApplicationAndField<Option[]>
  backgroundColor?: InputBackgroundColor
  largeButtons?: boolean
  required?: boolean
  space?: BoxProps['paddingTop']
  onSelect?(s: string): void
}

export interface SelectField extends BaseField {
  readonly type: FieldTypes.SELECT
  component: FieldComponents.SELECT
  options: MaybeWithApplicationAndField<Option[]>
  onSelect?(s: SelectOption, cb: (t: unknown) => void): void
  placeholder?: FormText
  backgroundColor?: InputBackgroundColor
  required?: boolean
}

export interface CompanySearchField extends BaseField {
  readonly type: FieldTypes.COMPANY_SEARCH
  component: FieldComponents.COMPANY_SEARCH
  placeholder?: FormText
  setLabelToDataSchema?: boolean
  shouldIncludeIsatNumber?: boolean
  checkIfEmployerIsOnForbiddenList?: boolean
  required?: boolean
}

export interface AsyncSelectField extends BaseField {
  readonly type: FieldTypes.ASYNC_SELECT
  component: FieldComponents.ASYNC_SELECT
  placeholder?: FormText
  loadOptions(c: Context): Promise<Option[]>
  onSelect?(s: SelectOption, cb: (t: unknown) => void): void
  loadingError?: FormText
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
  required?: boolean
}

export interface TextField extends BaseField {
  readonly type: FieldTypes.TEXT
  component: FieldComponents.TEXT
  disabled?: boolean
  readOnly?: boolean
  rightAlign?: boolean
  minLength?: number
  maxLength?: number
  placeholder?: FormText
  variant?: TextFieldVariant
  backgroundColor?: InputBackgroundColor
  format?: string | FormatInputValueFunction
  suffix?: string
  rows?: number
  required?: boolean
  onChange?: (...event: any[]) => void
}

export interface PhoneField extends BaseField {
  readonly type: FieldTypes.PHONE
  component: FieldComponents.PHONE
  disabled?: boolean
  readOnly?: boolean
  rightAlign?: boolean
  placeholder?: FormText
  backgroundColor?: InputBackgroundColor
  allowedCountryCodes?: string[]
  disableDropdown?: boolean
  required?: boolean
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
  readonly color?: Colors
  component: FieldComponents.DIVIDER
}

export interface KeyValueField extends BaseField {
  readonly type: FieldTypes.KEY_VALUE
  label: FormText
  value: FormText | FormTextArray
  component: FieldComponents.KEY_VALUE
  display?: 'block' | 'flex'
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
  introText?: StaticText
  description: StaticText
  startExpanded?: boolean
}

export interface AlertMessageField extends BaseField {
  readonly type: FieldTypes.ALERT_MESSAGE
  component: FieldComponents.ALERT_MESSAGE
  alertType?: 'default' | 'warning' | 'error' | 'info' | 'success'
  message?: FormText
  marginTop?: ResponsiveProp<Space>
  marginBottom?: ResponsiveProp<Space>
  links?: AlertMessageLink[]
}

export interface LinkField extends BaseField {
  readonly type: FieldTypes.LINK
  component: FieldComponents.LINK
  s3key?: FormText
  link?: string
  iconProps?: Pick<IconProps, 'icon' | 'type'>
}

export interface PaymentChargeOverviewField extends BaseField {
  readonly type: FieldTypes.PAYMENT_CHARGE_OVERVIEW
  component: FieldComponents.PAYMENT_CHARGE_OVERVIEW
  forPaymentLabel: StaticText
  totalLabel: StaticText
  getSelectedChargeItems: (
    application: Application,
  ) => { chargeItemCode: string; extraLabel?: StaticText }[]
}

export interface PdfLinkButtonField extends BaseField {
  readonly type: FieldTypes.PDF_LINK_BUTTON
  component: FieldComponents.PDF_LINK_BUTTON
  downloadButtonTitle: StaticText
  vertificationDescription: StaticText
  vertificationLinkTitle: StaticText
  vertificationLinkUrl: StaticText
  getPdfFiles?: (application: Application) => {
    base64: string
    buttonText?: StaticText
    customButtonText?: { is: string; en: string }
  }[]
  // isViewingFile: boolean
  // setIsViewingFile: (value: boolean) => void
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
  | PdfLinkButtonField
