import {
  Field,
  FormValue,
  MultiField,
  ExternalDataProvider,
  Repeater,
  FormNode,
  Schema,
} from '@island.is/application/template'

export interface FieldBaseProps {
  applicationId?: string
  autoFocus?: boolean
  error?: string
  field: Field
  formValue: FormValue
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

export enum FormModes {
  APPLYING = 'applying',
  APPROVED = 'approved',
  PENDING = 'pending',
  REVIEW = 'review',
  REJECTED = 'rejected',
}

export enum ProgressThemes {
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  RED = 'red',
}

export interface FieldComponentProps {
  applicationId: string
  autoFocus?: boolean
  error?: unknown
  field: FieldDef
  formValue: FormValue
  showFieldName?: boolean
}

export type ResolverContext = { formNode: FormNode; dataSchema: Schema }
