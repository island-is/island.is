import { FormSystemField } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch: Dispatch<Action>
}

export const Checkbox = ({ item, dispatch }: Props) => {
  const value = getValue(item, 'checkboxValue')
  console.log(value)
  return (
    <CheckboxField
      name="checkbox"
      label={item?.name?.is ?? ''}
      checked={value}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={(e) =>
        dispatch({
          type: 'SET_CHECKBOX_VALUE',
          payload: { id: item.id, value: e.target.checked },
        })
      }
    />
  )
}
