import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { ChangeEvent, useContext, useState } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'

interface Props {
  currentItem: FormSystemInput
}

export const Currency = ({ currentItem }: Props) => {
  const [currency, setCurrency] = useState('')
  const { control } = useContext(ControlContext)
  const label = control.activeItem?.data?.name?.is
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
          required={currentItem?.isRequired ?? false}
        />
      </Column>
    </Row>
  )
}
