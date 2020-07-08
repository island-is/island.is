import { Field } from '@island.is/application/schema'
import { Ref } from 'react'

export interface FieldBaseProps {
  field: Field
  autoFocus?: boolean
  showFieldName?: boolean
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: () => Ref<any> | null
}
