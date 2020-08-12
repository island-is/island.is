import { FormItem } from './Form'
import { Condition } from './Condition'

export interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
export interface BaseField extends FormItem {
  readonly id: string
  readonly component: FieldComponents
  readonly name: string
  readonly children: undefined
  condition?: Condition
  repeaterIndex?: number
  // TODO use something like this for non-schema validation?
  // validate?: (formValue: FormValue, context?: object) => boolean
}

export enum FieldTypes {
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
  INTRO = 'INTRO',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
}

export enum FieldComponents {
  CHECKBOX = 'CheckboxFormField',
  TEXT = 'TextFormField',
  INTRO = 'IntroductionFormField',
  RADIO = 'RadioFormField',
  SELECT = 'SelectFormField',
}

export interface Question extends BaseField {
  readonly isQuestion: true
  required?: boolean
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

export type Field =
  | CheckboxField
  | DateField
  | IntroductionField
  | RadioField
  | SelectField
  | TextField
