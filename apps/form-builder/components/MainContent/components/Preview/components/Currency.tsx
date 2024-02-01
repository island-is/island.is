import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { useState } from 'react'

export default function Currency({ label }) {
  const [currency, setCurrency] = useState('')
  const handleCurrencyChange = (e) => {
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
