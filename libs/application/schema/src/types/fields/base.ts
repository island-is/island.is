import { FormItem } from '../form'

export interface Option {
  value: string
  label: string
}

export interface ValidationError {
  error?: string
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
