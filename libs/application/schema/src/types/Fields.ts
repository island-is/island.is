import { FormItem } from './Form'

export interface Option {
  value: string
  label: string
}
export interface BaseField extends FormItem {
  readonly id: string
  readonly name: string
  readonly children: undefined
}

export enum FieldTypes {
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
  INTRO = 'INTRO',
  RADIO = 'RADIO',
  TEXT = 'TEXT',
}

export interface Question extends BaseField {
  readonly isQuestion: true
  required?: boolean
}

export interface CheckboxField extends Question {
  readonly type: FieldTypes.CHECKBOX
  options: Option[]
}

export interface DateField extends Question {
  readonly type: FieldTypes.DATE
  maxDate?: Date
  minDate?: Date
}

export interface IntroductionField extends BaseField {
  readonly type: FieldTypes.INTRO
  readonly introduction: string
}

export interface RadioField extends Question {
  readonly type: FieldTypes.RADIO
  options: Option[]
}

export interface TextField extends Question {
  readonly type: FieldTypes.TEXT
  minLength?: number
  maxLength?: number
}

export type Field =
  | CheckboxField
  | DateField
  | IntroductionField
  | RadioField
  | TextField
