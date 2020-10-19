import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'
import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderTypes } from './DataProvider'
import { MessageDescriptor } from 'react-intl'
import { Application } from './Application'

export type StaticText = MessageDescriptor | string

export type FormText = StaticText | ((application: Application) => StaticText)

export enum FormItemTypes {
  FORM = 'FORM',
  SECTION = 'SECTION',
  SUB_SECTION = 'SUB_SECTION',
  REPEATER = 'REPEATER',
  MULTI_FIELD = 'MULTI_FIELD',
  EXTERNAL_DATA_PROVIDER = 'EXTERNAL_DATA_PROVIDER',
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Schema = ZodObject<any>

export type FormMode =
  | 'review'
  | 'applying'
  | 'approved'
  | 'rejected'
  | 'pending'

export interface Form {
  id: string
  name: StaticText
  type: FormItemTypes.FORM
  mode?: FormMode
  icon?: string
  children: FormChildren[]
}

export type FormLeaf = MultiField | Field | Repeater | ExternalDataProvider
export type FormNode = Form | Section | SubSection | FormLeaf
export type FormChildren = Section | FormLeaf
export type SectionChildren = SubSection | FormLeaf

export interface FormItem {
  readonly id?: string
  condition?: Condition
  readonly type: string
  readonly name: FormText
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
  readonly id: string
  type: FormItemTypes.REPEATER
  // Repeaters always have custom representation
  component: string
  children: FormLeaf[]
  repetitions: number
  repeaterIndex?: number
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  repeaterIndex?: number
  readonly description?: FormText
}

export interface ExternalDataProvider extends FormItem {
  readonly type: FormItemTypes.EXTERNAL_DATA_PROVIDER
  readonly children: undefined
  repeaterIndex?: number
  dataProviders: DataProviderItem[]
}

export interface DataProviderItem {
  readonly id: string
  readonly type: DataProviderTypes
  readonly title: StaticText
  readonly subTitle?: StaticText
  readonly source?: string
}

export interface FieldBaseProps {
  autoFocus?: boolean
  error?: string
  field: Field
  application: Application
  showFieldName?: boolean
}

export type RepeaterProps = {
  application: Application
  expandRepeater: () => void
  error?: string
  repeater: Repeater
}
