import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { ChangeEvent, useState } from 'react'

interface Props {
  label: string
}

export default function Currency({ label }: Props) {
  const [currency, setCurrency] = useState('')
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
          label={label}
          name={'Currency'}
          value={currency}
          onChange={handleCurrencyChange}
        />
      </Column>
    </Row>
  )
}
