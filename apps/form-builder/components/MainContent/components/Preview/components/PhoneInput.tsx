import {
  GridRow as Row,
  GridColumn as Column,
  PhoneInput as Phone,
} from '@island.is/island-ui/core'
import { IInput } from '../../../../../types/interfaces'

interface Props {
  currentItem: IInput
}

export default function PhoneInput({ currentItem }: Props) {
  return (
    <Row>
      <Column span="10/10">
        <Phone label={currentItem.name.is} name="phone" />
      </Column>
    </Row>
  )
}
