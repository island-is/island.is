import { InputBackgroundColor } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'

export type Field = {
  id: string
  title: MessageDescriptor | string
  placeholder?: string
  format?: string
  backgroundColor?: InputBackgroundColor
  currency?: boolean
  readOnly?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
}

export type Props = {
  field: {
    props: {
      fields: Field[]
      repeaterButtonText: string
      repeaterHeaderText: string
      sumField: string
      currency: boolean
    }
  }
}
