import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'

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

export type FormNode =
  | Form
  | Section
  | SubSection
  | Repeater
  | MultiField
  | Field

export type FormLeaf = MultiField | Field | Repeater
export type FormChildren = Section | FormLeaf
export type SectionChildren = SubSection | FormLeaf

export interface FormItem {
  readonly id?: string
  readonly type: string
  readonly name: string
}

export interface Section extends FormItem {
  type: FormItemTypes.SECTION
  children: SectionChildren[]
}

export interface SubSection extends FormItem {
  type: FormItemTypes.SUB_SECTION
  children: FormLeaf[]
}

export interface Repeater extends FormItem {
  type: FormItemTypes.REPEATER
  children: FormLeaf[]
  condition?: Condition
  repetitions: number
  required?: boolean
  repeaterIndex?: number
  // todo how do we handle presentation of different repeaters? maybe a map to a react component?
  // presentation: RepeaterPresentorsEnum....
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  condition?: Condition
  repeaterIndex?: number
}

export type Answer = string | number | Answer[] | FormValue

export interface FormValue {
  [key: string]: Answer
}
