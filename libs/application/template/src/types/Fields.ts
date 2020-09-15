import { FormItem } from './Form'
import { Condition } from './Condition'

export interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
export type FieldWidth = 'full' | 'half'

export interface BaseField extends FormItem {
  readonly id: string
  readonly component: FieldComponents | CustomFieldComponents // TODO maybe this does not belong here, and application-form lib has a map from type to component
  readonly name: string
  readonly children: undefined
  width?: FieldWidth
  condition?: Condition
  repeaterIndex?: number
  // TODO use something like this for non-schema validation?
  // validate?: (formValue: FormValue, context?: object) => boolean
}

export enum FieldTypes {
  CHECKBOX = 'CHECKBOX',
  CUSTOM = 'CUSTOM', // TODO if we map type to component, then we must have unique field type for each custom field
  DATE = 'DATE',
  INTRO = 'INTRO',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  FILEUPLOAD = 'FILEUPLOAD',
}

export enum CustomFieldComponents {
  Country = 'ExampleCountryField',
  PARENTAL_LEAVE_CALCULATIONS = 'ParentalLeaveCalculations',
  PARENTAL_LEAVE_PERIODS = 'ParentalLeavePeriods',
  PARENTAL_LEAVE_USAGE = 'ParentalLeaveUsage',
}

export enum FieldComponents {
  CHECKBOX = 'CheckboxFormField',
  TEXT = 'TextFormField',
  INTRO = 'IntroductionFormField',
  RADIO = 'RadioFormField',
  SELECT = 'SelectFormField',
  FILEUPLOAD = 'FileUploadFormField',
}

export interface Question extends BaseField {
  readonly isQuestion: true
  required?: boolean
  disabled?: boolean
}

export interface CheckboxField extends Question {
  readonly type: FieldTypes.CHECKBOX
  component: FieldComponents.CHECKBOX
  options: Option[]
}

export interface DateField extends Question {
  readonly type: FieldTypes.DATE
  component: FieldComponents.TEXT // TODO needs a component
  maxDate?: Date
  minDate?: Date
}

export interface IntroductionField extends BaseField {
  readonly type: FieldTypes.INTRO
  component: FieldComponents.INTRO
  readonly introduction: string
}

export interface RadioField extends Question {
  readonly type: FieldTypes.RADIO
  component: FieldComponents.RADIO
  options: Option[]
}

export interface SelectField extends Question {
  readonly type: FieldTypes.SELECT
  component: FieldComponents.SELECT
  options: Option[]
  placeholder?: string
}

export interface TextField extends Question {
  readonly type: FieldTypes.TEXT
  component: FieldComponents.TEXT
  minLength?: number
  maxLength?: number
  placeholder?: string
}

export interface FileUploadField extends Question {
  readonly type: FieldTypes.FILEUPLOAD
  component: FieldComponents.FILEUPLOAD
  readonly introduction: string
  readonly uploadHeader?: string
  readonly uploadDescription?: string
  readonly uploadButtonLabel?: string
  readonly uploadMultiple?: boolean
  readonly uploadAccept?: string
}

export interface CustomField extends Question {
  readonly type: FieldTypes.CUSTOM
  readonly component: CustomFieldComponents
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
