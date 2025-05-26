import {
  Input,
  Stack,
  GridColumn as Column,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Dispatch, useState } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
}

export const NationalId = ({ item, dispatch, hasError }: Props) => {
  const { formatMessage } = useIntl()
  const [nationalId, setNationalId] = useState<string>(
    getValue(item, 'nationalId'),
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, setName] = useState<string>(getValue(item, 'name'))

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const raw = e.target.value
    let digits = raw.replace(/\D/g, '')

    // Last character must be a digit, hyphen or backspace
    if (raw.length > 0 && !/\d$/.test(raw) && !raw.endsWith('-')) return

    if (digits.length > 10) {
      digits = digits.slice(0, 10)
    }

    const value =
      digits.length > 6 ? digits.slice(0, 6) + '-' + digits.slice(6) : digits

    setNationalId(value)
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
            required={item?.isRequired ?? false}
            backgroundColor="blue"
            value={nationalId}
            onChange={handleChange}
            hasError={!!hasError}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input
            label={formatMessage(m.namePerson)}
            name="nafn"
            disabled
            value={name}
          />
        </Column>
      </Row>
    </Stack>
  )
}
