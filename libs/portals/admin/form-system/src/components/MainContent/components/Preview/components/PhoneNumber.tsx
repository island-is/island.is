import { FormSystemInput } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  PhoneInput,
} from '@island.is/island-ui/core'

interface Props {
  currentItem: FormSystemInput
}

export const PhoneNumber = ({ currentItem }: Props) => {
  return (
    <Row>
      <Column>
        <PhoneInput
          label="Símanúmer"
          placeholder="Símanúmer"
          name="phoneNumber"
          required={currentItem.isRequired ?? false}
        />
      </Column>
    </Row>
  )
}


