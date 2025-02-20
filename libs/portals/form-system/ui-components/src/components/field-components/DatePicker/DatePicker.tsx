import { FormSystemField } from '@island.is/api/schema'
import { Dispatch, useState } from 'react'
import { Action } from '../../../lib'
import { DatePicker as DatePickerCore } from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'


interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}
export const DatePicker = ({ item, dispatch }: Props) => {
  const [value, setValue] = useState<Date | null>(getValue(item, 'date') ?? null)
  const { formatMessage } = useIntl()
  const handleChange = (date: Date) => {
    setValue(date)
    if (!dispatch) return
    dispatch({
      type: 'SET_DATE',
      payload: {
        id: item.id,
        value: date,
      },
    })
  }
  return (
    <DatePickerCore
      label={formatMessage(m.datePicker)}
      placeholderText={formatMessage(m.chooseDate)}
      backgroundColor='blue'
      handleChange={handleChange}
      selected={value}
    />
  )
}