import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'
import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderTypes } from './DataProvider'

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

export type FormMode = 'review' | 'applying' | 'approved' | 'rejeced'

export interface Form {
  id: ApplicationTypes
  name: string
  type: FormItemTypes.FORM
  mode?: FormMode
  icon?: string
  ownerId: string
  children: FormChildren[]
}

export type FormLeaf = MultiField | Field | Repeater | ExternalDataProvider
export type FormNode = Form | Section | SubSection | FormLeaf

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
  labelKey: string
  // todo how do we handle presentation of different repeaters? maybe a map to a react component?
  // presentation: RepeaterPresentorsEnum....
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  condition?: Condition
  repeaterIndex?: number
}

export interface ExternalDataProvider extends FormItem {
  readonly type: FormItemTypes.EXTERNAL_DATA_PROVIDER
  readonly children: undefined
  condition?: Condition
  repeaterIndex?: number
  dataProviders: DataProviderItem[]
}

export interface DataProviderItem {
  readonly id: string
  readonly type: DataProviderTypes
  readonly title: string
  readonly subTitle?: string
  readonly source?: string
}
