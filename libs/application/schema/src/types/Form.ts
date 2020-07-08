import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'

export interface ValidationError {
  [key: string]: {
    type: string
    message: string
    value: Answer
  }
}

export enum FormItemTypes {
  FORM = 'FORM',
  SECTION = 'SECTION',
  SUB_SECTION = 'SUB_SECTION',
  REPEATER = 'REPEATER',
  MULTI_FIELD = 'MULTI_FIELD',
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Schema = ZodObject<any>

export interface Form {
  id: string
  name: string
  schema: Schema
  type: FormItemTypes.FORM
  icon?: string
  ownerId: string
  children: FormChildren[]
}

export type FormChildren = Section | MultiField | Repeater | Field
export type SectionChildren = SubSection | MultiField | Repeater | Field
export type SubSectionChildren = MultiField | Repeater | Field
export type RepeaterChildren = MultiField | Repeater | Field

export interface FormItem {
  readonly id?: string
  readonly type: string
  readonly name: string
  condition?: Condition
}

export interface Section extends FormItem {
  type: FormItemTypes.SECTION
  children: SectionChildren[]
}

export interface SubSection extends FormItem {
  type: FormItemTypes.SUB_SECTION
  children: SubSectionChildren[]
}

export interface Repeater extends FormItem {
  type: FormItemTypes.REPEATER
  children: RepeaterChildren[]
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
}

export type Answer = string | number | object | string[]

export type Answers = { [key: string]: Answer }
