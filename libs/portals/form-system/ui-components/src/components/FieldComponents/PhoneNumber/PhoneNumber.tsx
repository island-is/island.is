import { FormSystemField } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  PhoneInput,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { Dispatch, useState } from 'react'
import { Action, m } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { Locale } from '@island.is/shared/types'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  hasError?: boolean
}

export const PhoneNumber = ({
  item,
  dispatch,
  hasError,
  lang = 'is',
}: Props) => {
  const { locale, formatMessage } = useIntl()
  const [phoneNumber, setPhoneNumber] = useState<string>(
    getValue(item, 'phoneNumber'),
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPhoneNumber(e.target.value)
    if (!dispatch) return
    dispatch({
      type: 'SET_PHONE_NUMBER',
      payload: {
        id: item.id,
        value: e.target.value,
      },
    })
  }

  return (
    <Row>
      <Column>
        <PhoneInput
          label={item.name?.[lang] ?? ''}
          placeholder={formatMessage(m.phoneNumber)}
          name={item.id ?? ''}
          locale={locale as Locale}
          required={item.isRequired ?? false}
          backgroundColor="blue"
          value={phoneNumber}
          onChange={handleChange}
          hasError={!!hasError}
        />
      </Column>
    </Row>
  )
}
