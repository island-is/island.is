import { Field } from '@island.is/application/schema'

export interface FieldBaseProps {
  field: Field
  autoFocus?: boolean
  showFieldName?: boolean
  register: () => void
}
