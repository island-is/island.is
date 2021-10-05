import { Dispatch, SetStateAction } from 'react'
import { GraphQLError } from 'graphql'
import { ZodObject } from 'zod'
import { MessageDescriptor } from 'react-intl'

import type { BoxProps } from '@island.is/island-ui/core/types'
import { Field, RecordObject } from '@island.is/application/core'

import { Condition } from './Condition'
import { Application } from './Application'

export type BeforeSubmitCallback = () => Promise<[true, null] | [false, string]>

export type SetBeforeSubmitCallback = (
  callback: BeforeSubmitCallback | null,
) => void

export type SetFieldLoadingState = Dispatch<SetStateAction<boolean>>

export type StaticTextObject = MessageDescriptor & {
  values?: RecordObject<any>
}

export type StaticText = StaticTextObject | string

export type FormatMessage = (
  descriptor: StaticText,
  values?: RecordObject<any>,
) => string

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
  APPLYING = 'applying',
  EDITING = 'editing',
  APPROVED = 'approved',
  PENDING = 'pending',
  REVIEW = 'review',
  REJECTED = 'rejected',
}

export interface Form {
  children: FormChildren[]
  icon?: string
  id: string
  logo?: React.FC
  mode?: FormModes
  renderLastScreenBackButton?: boolean
  renderLastScreenButton?: boolean
  // When initialising the form and finding the
  // current screen this will make sure we won't
  // traverse over any screen that should have an answer
  // but does not
  stopOnFirstMissingAnswer?: boolean
  title: StaticText
  type: FormItemTypes.FORM
}

export type FormLeaf = MultiField | Field | Repeater | ExternalDataProvider
export type FormNode = Form | Section | SubSection | FormLeaf
export type FormChildren = Section | FormLeaf
export type SectionChildren = SubSection | FormLeaf

export interface FormItem {
  readonly id?: string
  condition?: Condition
  readonly type: string
  readonly title: FormText
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
  checkboxLabel?: StaticText
  subTitle?: StaticText
  description?: StaticText
}

export interface DataProviderItem {
  readonly id: string
  readonly type: string | undefined
  readonly title: StaticText
  readonly subTitle?: StaticText
  readonly source?: string
  readonly parameters?: any
}

export interface FieldBaseProps {
  autoFocus?: boolean
  error?: string
  errors?: RecordObject
  field: Field
  application: Application
  showFieldName?: boolean
  goToScreen?: (id: string) => void
  refetch?: () => void
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
  setFieldLoadingState?: SetFieldLoadingState
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
