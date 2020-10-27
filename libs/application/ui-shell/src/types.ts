import {
  Field,
  MultiField,
  ExternalDataProvider,
  Repeater,
  FormNode,
  Schema,
  FormValue,
} from '@island.is/application/core'

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
  isNavigable?: boolean
} & ExternalDataProvider

export type FormScreen =
  | FieldDef
  | ExternalDataProviderScreen
  | MultiFieldScreen
  | RepeaterScreen

export type ResolverContext = {
  formNode: FormNode
  dataSchema: Schema
}
