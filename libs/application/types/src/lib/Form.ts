import { Dispatch, SetStateAction } from 'react'
import { GraphQLError } from 'graphql'
import { ZodObject } from 'zod'
import { MessageDescriptor } from 'react-intl'

import type { BoxProps } from '@island.is/island-ui/core/types'

import {
  Field,
  FieldComponents,
  FieldTypes,
  RecordObject,
  SubmitField,
} from './Fields'
import { Condition } from './Condition'
import { Application, FormValue } from './Application'
import { TestSupport } from '@island.is/island-ui/utils'

export type BeforeSubmitCallback = () => Promise<[true, null] | [false, string]>

export type SetBeforeSubmitCallback = (
  callback: BeforeSubmitCallback | null,
) => void

export type SetFieldLoadingState = Dispatch<SetStateAction<boolean>>
export type SetSubmitButtonDisabled = Dispatch<SetStateAction<boolean>>

export type StaticTextObject = MessageDescriptor & {
  values?: RecordObject<any>
}

export type GenericFormField<T> = Partial<
  T & { id: string; initial: boolean; dummy?: boolean }
>

export type StaticText = StaticTextObject | string

export type FormText =
  | StaticText
  | ((application: Application) => StaticText | null | undefined)

export type FormTextArray =
  | StaticText[]
  | ((application: Application) => (StaticText | null | undefined)[])

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

export enum FormModes {
  NOT_STARTED = 'notstarted',
  DRAFT = 'draft',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Form {
  children: FormChildren[]
  icon?: string
  id: string
  logo?: React.FC<React.PropsWithChildren<unknown>>
  mode?: FormModes
  renderLastScreenBackButton?: boolean
  renderLastScreenButton?: boolean
  title: StaticText
  type: FormItemTypes.FORM
}

export interface FormLoaderArgs {
  featureFlagClient: unknown
}

export type FormLoader = (args: FormLoaderArgs) => Promise<Form>

export type FormLeaf = MultiField | Field | Repeater | ExternalDataProvider
export type FormNode = Form | Section | SubSection | FormLeaf
export type FormChildren = Section | FormLeaf
export type SectionChildren = SubSection | FormLeaf
export type FormItemChildren = Section | SubSection | FormLeaf

export interface FormItem extends TestSupport {
  readonly id?: string
  condition?: Condition
  readonly type: string
  readonly title: FormText
}

export interface Section extends FormItem {
  type: FormItemTypes.SECTION
  children: SectionChildren[]
  draftPageNumber?: number
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
  isPartOfRepeater?: boolean
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  isPartOfRepeater?: boolean
  readonly description?: FormText
  space?: BoxProps['paddingTop']
}

export interface ExternalDataProvider extends FormItem {
  readonly type: FormItemTypes.EXTERNAL_DATA_PROVIDER
  readonly children: undefined
  isPartOfRepeater?: boolean
  dataProviders: DataProviderItem[]
  otherPermissions?: DataProviderPermissionItem[]
  checkboxLabel?: StaticText
  subTitle?: StaticText
  description?: StaticText
  submitField?: SubmitField
}

export interface DataProviderItem {
  readonly id: string
  readonly action?: string
  readonly order?: number
  readonly title: FormText
  readonly subTitle?: FormText
  readonly pageTitle?: FormText
  readonly source?: string //TODO see if we can remove this
}

export interface DataProviderBuilderItem {
  id?: string
  type?: string //TODO REMOVE THIS
  title: FormText
  subTitle?: FormText
  pageTitle?: FormText
  source?: string
  provider?: Provider
}
export interface Provider {
  externalDataId?: string
  actionId: string
  action: string
  order?: number
}

export type DataProviderPermissionItem = Omit<
  DataProviderItem,
  'type' | 'source' | 'parameters'
>
export interface FieldBaseProps<TAnswers = FormValue> {
  autoFocus?: boolean
  error?: string
  errors?: RecordObject
  field: Field
  application: Application<TAnswers>
  showFieldName?: boolean
  goToScreen?: (id: string) => void
  refetch?: () => void
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  setFieldLoadingState?: SetFieldLoadingState
  setSubmitButtonDisabled?: SetSubmitButtonDisabled
}

export type RepeaterProps = {
  application: Application
  expandRepeater: () => void
  error?: string
  repeater: Repeater
  removeRepeaterItem: (index: number) => void
  setRepeaterItems: (
    items: unknown[],
  ) => Promise<{ errors?: ReadonlyArray<GraphQLError> }>
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  setFieldLoadingState?: SetFieldLoadingState
}

export type ValidationRecord = { [key: string]: string | ValidationRecord }

type FieldValue = string | number | boolean | Date

export interface IField {
  id: string
  title: string
  description?: string
  isPartOfRepeater?: boolean
  type: FieldTypes
  component: FieldComponents
  disabled?: boolean
  width?: string
  colSpan?: string
  defaultValue?: string
  doesNotRequireAnswer?: boolean
  specifics?: Record<string, FieldValue>
}

export interface IDataProviderItem {
  id: string
  action?: string
  order?: number
  title: string
  subTitle?: string
  pageTitle?: string
  source?: string
}

export interface IFormItem {
  condition?: Condition
  title: string
  id: string
  type: FormItemTypes
  isPartOfRepeater?: boolean
  description?: string
  space?: string
  children: IFormItem[]
  fields?: IField[]
  draftPageNumber?: number
  dataProviders?: IDataProviderItem[]
}

export interface IForm {
  children: IFormItem[]
  icon?: string
  id: string
  logo?: string
  mode?: string
  renderLastScreenBackButton?: boolean
  renderLastScreenButton?: boolean
  title: string
  type: FormItemTypes.FORM
}
