import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { ChangeEvent, Dispatch, useState } from 'react'
import { FormSystemField } from '@island.is/api/schema'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
}

export const CurrencyField = ({ item, dispatch, hasError }: Props) => {
  const [currency, setCurrency] = useState(getValue(item, 'iskNumber'))
  const label = item?.name?.is

  const handleCurrencyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Remove any non-digit characters from the input value
    const inputValue = e.target.value.replace(/\D/g, '')
    // Split the input value into groups of three characters
    const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    setCurrency(formattedValue)
    if (!dispatch) return
    dispatch({
      type: 'SET_CURRENCY',
      payload: {
        value: formattedValue,
        id: item.id,
      },
    })
  }

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Input
          label={label ?? ''}
          name="Currency"
          value={currency}
          onChange={handleCurrencyChange}
          required={item?.isRequired ?? false}
          backgroundColor="blue"
          hasError={!!hasError}
        />
      </Column>
    </Row>
  )
}
