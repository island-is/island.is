import { Input, Stack, GridColumn as Column, GridRow as Row } from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
}

export const NationalId = ({ item }: Props) => {
  const { formatMessage } = useIntl()
  return (

    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.nationalId)}
            name="kennitala"
            type="number"
            required={item?.isRequired ?? false}
            backgroundColor='blue'
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input label={formatMessage(m.namePerson)} name="nafn" disabled />
        </Column>
      </Row>
    </Stack>

  )
}
