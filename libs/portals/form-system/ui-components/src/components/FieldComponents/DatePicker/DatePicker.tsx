import { FormSystemField } from '@island.is/api/schema'
import { Dispatch, useState } from 'react'
import { Action } from '../../../lib'
import { DatePicker as DatePickerCore } from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import { parseISO } from 'date-fns'


interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
  hasError?: boolean
}
export const DatePicker = ({ item, dispatch, lang, hasError }: Props) => {
  const [value, setValue] = useState<Date | null>(parseISO(getValue(item, 'date')) ?? null)
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
      label={item.name[lang] ?? ''}
      placeholderText={formatMessage(m.chooseDate)}
      backgroundColor='blue'
      handleChange={handleChange}
      selected={value}
      required={item.isRequired}
      hasError={!!hasError}
    />
  )
}