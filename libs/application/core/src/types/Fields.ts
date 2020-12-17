import { Colors } from '@island.is/island-ui/theme'
import { ApolloClient } from '@apollo/client'
import { FormText, FormItem } from './Form'
import { Condition } from './Condition'
import { CallToAction } from './StateMachine'
import { Application } from './Application'
import { FormatInputValueFunction } from 'react-number-format'

export interface Option {
  value: string
  label: FormText
  tooltip?: FormText
  excludeOthers?: boolean
}

interface SelectOption {
  label: string
  value: string | number
}

export type MaybeWithApplication<T> = T | ((a: Application) => T)

export type FieldWidth = 'full' | 'half'
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

export interface BaseField extends FormItem {
  readonly id: string
  readonly component: FieldComponents | string
  readonly name: FormText
  readonly description?: FormText
  readonly children: undefined
  disabled?: boolean
  width?: FieldWidth
  condition?: Condition
  isPartOfRepeater?: boolean
  defaultValue?: MaybeWithApplication<unknown>
  // TODO use something like this for non-schema validation?
  // validate?: (formValue: FormValue, context?: object) => boolean
}

export enum FieldTypes {
  CHECKBOX = 'CHECKBOX',
  CUSTOM = 'CUSTOM',
  DATE = 'DATE',
  INTRO = 'INTRO',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  FILEUPLOAD = 'FILEUPLOAD',
  SUBMIT = 'SUBMIT',
  DIVIDER = 'DIVIDER',
  ASYNC_SELECT = 'ASYNC_SELECT',
}

export enum FieldComponents {
  CHECKBOX = 'CheckboxFormField',
  DATE = 'DateFormField',
  TEXT = 'TextFormField',
  INTRO = 'IntroductionFormField',
  RADIO = 'RadioFormField',
  SELECT = 'SelectFormField',
  FILEUPLOAD = 'FileUploadFormField',
  DIVIDER = 'DividerFormField',
  SUBMIT = 'SubmitFormField',
  ASYNC_SELECT = 'AsyncSelectFormField',
}

export interface CheckboxField extends BaseField {
  readonly type: FieldTypes.CHECKBOX
  component: FieldComponents.CHECKBOX
  options: MaybeWithApplication<Option[]>
}

export interface DateField extends BaseField {
  readonly type: FieldTypes.DATE
  placeholder?: FormText
  component: FieldComponents.DATE
  maxDate?: Date
  minDate?: Date
}

export interface IntroductionField extends BaseField {
  readonly type: FieldTypes.INTRO
  component: FieldComponents.INTRO
  readonly introduction: FormText
}

export interface RadioField extends BaseField {
  readonly type: FieldTypes.RADIO
  component: FieldComponents.RADIO
  options: MaybeWithApplication<Option[]>
  emphasize?: boolean
  largeButtons?: boolean
}

export interface SelectField extends BaseField {
  readonly type: FieldTypes.SELECT
  component: FieldComponents.SELECT
  options: MaybeWithApplication<Option[]>
  onSelect?: (s: SelectOption, cb: (t: unknown) => void) => void
  placeholder?: FormText
}

export interface AsyncSelectField extends BaseField {
  readonly type: FieldTypes.ASYNC_SELECT
  component: FieldComponents.ASYNC_SELECT
  placeholder?: FormText
  loadOptions: (c: Context) => Promise<Option[]>
  onSelect?: (s: SelectOption, cb: (t: unknown) => void) => void
  loadingError?: FormText
}

export interface TextField extends BaseField {
  readonly type: FieldTypes.TEXT
  component: FieldComponents.TEXT
  disabled?: boolean
  minLength?: number
  maxLength?: number
  placeholder?: FormText
  variant?: TextFieldVariant
  format?: string | FormatInputValueFunction
}

export interface FileUploadField extends BaseField {
  readonly type: FieldTypes.FILEUPLOAD
  component: FieldComponents.FILEUPLOAD
  readonly introduction: FormText
  readonly uploadHeader?: string
  readonly uploadDescription?: string
  readonly uploadButtonLabel?: string
  readonly uploadMultiple?: boolean
  readonly uploadAccept?: string
}

export interface SubmitField extends BaseField {
  readonly type: FieldTypes.SUBMIT
  component: FieldComponents.SUBMIT
  readonly actions: CallToAction[]
  readonly placement: 'footer' | 'screen'
}

export interface DividerField extends BaseField {
  readonly type: FieldTypes.DIVIDER
  readonly color?: Colors
  component: FieldComponents.DIVIDER
}

export interface CustomField extends BaseField {
  readonly type: FieldTypes.CUSTOM
  readonly component: string
  props?: object
}

export type Field =
  | CheckboxField
  | CustomField
  | DateField
  | IntroductionField
  | RadioField
  | SelectField
  | TextField
  | FileUploadField
  | DividerField
  | SubmitField
  | AsyncSelectField
