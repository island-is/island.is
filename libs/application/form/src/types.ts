import {
  Field,
  FormValue,
  MultiField,
  ExternalDataProvider,
  Repeater,
} from '@island.is/application/schema'
import { Ref } from 'react'

export interface FieldBaseProps {
  autoFocus?: boolean
  error?: string
  field: Field
  formValue: FormValue
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: () => Ref<any> | null
  showFieldName?: boolean
}

export type FieldDef = {
  isNavigable?: boolean
} & Field

export type MultiFieldScreen = {
  isNavigable?: boolean
} & MultiField & {
    children: FieldDef[]
  }

export type RepeaterScreen = {
  isNavigable?: boolean
  isExpanded?: boolean
} & Repeater & {
    children: (FieldDef | MultiFieldScreen | RepeaterScreen)[]
  }

export type ExternalDataProviderScreen = {
  isNavigable: true
} & ExternalDataProvider

export type FormScreen =
  | FieldDef
  | ExternalDataProviderScreen
  | MultiFieldScreen
  | RepeaterScreen
