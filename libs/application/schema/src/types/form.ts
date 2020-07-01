import { Condition } from './condition'
import { Field } from './fields'

export enum FormItemTypes {
  FORM = 'FORM',
  SECTION = 'SECTION',
  SUB_SECTION = 'SUB_SECTION',
  REPEATER = 'REPEATER',
  MULTI_FIELD = 'MULTI_FIELD',
}

export interface Form {
  id: string
  name: string
  type: FormItemTypes.FORM
  icon?: string
  ownerId: string
  children: FormChildren[]
}

export type FormChildren = Section | MultiField | Field | Repeater
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

export type Answers = object
