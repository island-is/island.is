import { Colors } from '@island.is/island-ui/theme'
import { FormText, FormItem } from './Form'
import { Condition } from './Condition'
import { CallToAction } from './StateMachine'
import { Application } from './Application'

export interface Option {
  value: string
  label: FormText
  tooltip?: FormText
  excludeOthers?: boolean
}

export type MaybeWithApplication<T> = T | ((a: Application) => T)

export type FieldWidth = 'full' | 'half'
export type TextFieldVariant = 'text' | 'email' | 'number' | 'tel' | 'textarea'

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
  placeholder?: FormText
}

export interface TextField extends BaseField {
  readonly type: FieldTypes.TEXT
  component: FieldComponents.TEXT
  disabled?: boolean
  minLength?: number
  maxLength?: number
  placeholder?: FormText
  variant?: TextFieldVariant
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
