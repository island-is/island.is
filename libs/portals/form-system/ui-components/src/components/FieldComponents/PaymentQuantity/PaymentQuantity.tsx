import { FormSystemField } from '@island.is/api/schema'
import { GridColumn as Column, Input, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const PaymentQuantity = ({ item, dispatch }: Props) => {
  const { lang } = useLocale()
  const { isDropdown, minValue, maxValue } = item.fieldSettings
    ? item.fieldSettings
    : { isDropdown: false }

  const selectOptions = () => {
    const options = []
    for (let i = minValue || 1; i <= (maxValue || 100); i++) {
      options.push({ value: String(i), label: String(i) })
    }
    return options
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = Math.max(
      minValue || 0,
      Math.min(maxValue || Infinity, Number(value)),
    )
    dispatch?.({
      type: 'UPDATE_FIELD',
      payload: { id: item.id, value: numValue },
    })
  }
  console.log('PaymentQuantity render', item.fieldSettings)
  return (
    <Column span="6/12">
      {isDropdown ? (
        <Select
          label={item.name?.[lang] ?? ''}
          name={`${item.id}.paymentQuantity`}
          backgroundColor="blue"
          options={selectOptions()}
          placeholder="Veldu fjölda"
        />
      ) : (
        <Input
          label={item.name?.[lang] ?? ''}
          name={`${item.id}.paymentQuantity`}
          backgroundColor="blue"
          type="number"
          placeholder="Veldu fjölda"
          min={minValue || 0}
          max={maxValue || 100}
        />
      )}
    </Column>
  )
}
