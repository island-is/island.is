import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'
import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderTypes } from './DataProvider'
import { MessageDescriptor } from 'react-intl'
import { ExternalData, FormValue } from './Application'

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
  id: ApplicationTypes
  name: MessageDescriptor | string
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
  condition?: Condition
  readonly type: string
  readonly name: MessageDescriptor | string
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
  required?: boolean
  repeaterIndex?: number
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  repeaterIndex?: number
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
  readonly title: MessageDescriptor | string
  readonly subTitle?: MessageDescriptor | string
  readonly source?: string
}

export interface FieldBaseProps {
  applicationId?: string
  autoFocus?: boolean
  error?: string
  field: Field
  formValue: FormValue
  showFieldName?: boolean
}

export type RepeaterProps = {
  expandRepeater: () => void
  error?: string
  repeater: Repeater
  formValue: FormValue
  externalData: ExternalData
}
