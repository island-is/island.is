import { FormSystemInput } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  PhoneInput,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemInput
}

export const PhoneNumber = ({ item }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <Row>
      <Column>
        <PhoneInput
          label={formatMessage(m.phoneNumber)}
          placeholder={formatMessage(m.phoneNumber)}
          name="phoneNumber"
          required={item.isRequired ?? false}
        />
      </Column>
    </Row>
  )
}
