import { Input, Stack, GridColumn as Column, GridRow as Row } from '@island.is/island-ui/core'
import { FormSystemInput } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'

interface Props {
  currentItem: FormSystemInput
}

export const NationalId = ({ currentItem }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Row marginTop={2}>
        <Column span="5/10">
          <Input
            label={formatMessage(m.nationalId)}
            name="kennitala"
            type="number"
            required={currentItem?.isRequired ?? false}
          />
        </Column>
      </Row>
      <Row marginTop={2}>
        <Column span="7/10">
          <Input label={formatMessage(m.namePerson)} name="nafn" disabled />
        </Column>
      </Row>
    </>
  )
}
