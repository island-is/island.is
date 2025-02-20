import { Input, Stack, GridColumn as Column, GridRow as Row } from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Dispatch, useState } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const NationalId = ({ item, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const [nationalId, setNationalId] = useState<string>(getValue(item, 'nationalId'))
  const [name, setName] = useState<string>(getValue(item, 'name'))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNationalId(e.target.value)
    if (!dispatch) return
    dispatch({
      type: 'SET_NATIONAL_ID',
      payload: {
        id: item.id,
        value: e.target.value,
      },
    })
  }
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
            value={nationalId}
            onChange={handleChange}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input label={formatMessage(m.namePerson)} name="nafn" disabled value={name} />
        </Column>
      </Row>
    </Stack>

  )
}
