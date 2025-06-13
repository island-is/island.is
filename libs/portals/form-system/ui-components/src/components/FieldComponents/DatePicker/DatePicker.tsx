import { FormSystemField } from '@island.is/api/schema'
import { Dispatch, useState } from 'react'
import { Action } from '../../../lib'
import { DatePicker as DatePickerCore } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import { parseISO } from 'date-fns' // eslint-disable-line no-restricted-imports

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
  hasError?: boolean
}
export const DatePicker = ({ item, dispatch, lang, hasError }: Props) => {
  const [value, setValue] = useState<Date | null>(() => {
    const dateValue = getValue(item, 'date')
    if (!dateValue) return null
    try {
      return parseISO(dateValue)
    } catch {
      return null
    }
  })
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
      backgroundColor="blue"
      handleChange={handleChange}
      selected={value ?? null}
      required={item.isRequired}
      hasError={!!hasError}
    />
  )
}
