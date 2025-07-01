import { FormSystemField } from '@island.is/api/schema'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { DatePicker as DatePickerCore } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { getValue } from '../../../lib/getValue'
import { parseISO } from 'date-fns' // eslint-disable-line no-restricted-imports
import { useFormContext, Controller } from 'react-hook-form'
import { DatePickerController } from '@island.is/shared/form-fields'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang: 'is' | 'en'
}

export const DatePicker = ({ item, dispatch, lang = 'is' }: Props) => {
  const { formatMessage } = useIntl()

  const handleDateChange = (dateString: string) => {
    if (dispatch) {
      const date = dateString ? parseISO(dateString) : null
      dispatch({
        type: 'SET_DATE',
        payload: {
          id: item.id,
          value: date,
        },
      })
    }
  }

  return (
    <DatePickerController
      label={item.name[lang] ?? ''}
      placeholder={formatMessage(m.chooseDate)}
      id={item.id}
      locale={lang}
      defaultValue={getValue(item, 'date')}
      backgroundColor="blue"
      onChange={handleDateChange}
      maxDate={new Date()}
      minDate={new Date(1970, 0)}
      required
    />
  )
}
