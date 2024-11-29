import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { ChangeEvent, useState } from 'react'
import { FormSystemField } from '@island.is/api/schema'

interface Props {
  item: FormSystemField
}

export const CurrencyField = ({ item }: Props) => {
  const [currency, setCurrency] = useState('')
  const label = item?.name?.is

  const handleCurrencyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Remove any non-digit characters from the input value
    const inputValue = e.target.value.replace(/\D/g, '')
    // Split the input value into groups of three characters
    const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    setCurrency(formattedValue)
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
        />
      </Column>
    </Row>
  )
}
