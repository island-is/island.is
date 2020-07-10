import { Field, MultiField } from '@island.is/application/schema'
import { Ref } from 'react'

export interface FieldBaseProps {
  autoFocus?: boolean
  field: Field
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: () => Ref<any> | null
  showFieldName?: boolean
}

export type FieldDef = {
  isVisible?: boolean
} & Field

export type MultiFieldScreen = {
  isVisible?: boolean
} & MultiField & {
    children: FieldDef[]
  }

export type FormScreen = FieldDef | MultiFieldScreen
