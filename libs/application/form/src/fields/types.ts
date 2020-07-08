import { Field } from '@island.is/application/schema'
import { Ref } from 'react'

export interface FieldBaseProps {
  field: Field
  autoFocus?: boolean
  showFieldName?: boolean
  register: () => Ref<any> | null
}
