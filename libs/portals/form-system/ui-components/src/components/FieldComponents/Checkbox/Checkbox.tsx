import { FormSystemField } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  lang?: 'is' | 'en'
}

export const Checkbox = ({ item, dispatch, hasError, lang = 'is' }: Props) => {
  const value = getValue(item, 'checkboxValue')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dispatch) return
    dispatch({
      type: 'SET_CHECKBOX_VALUE',
      payload: { id: item.id, value: e.target.checked },
    })
  }
  return (
    <CheckboxField
      name="checkbox"
      label={item?.name?.[lang] ?? ''}
      checked={value}
      onChange={handleChange}
      hasError={!!hasError}
    />
  )
}
