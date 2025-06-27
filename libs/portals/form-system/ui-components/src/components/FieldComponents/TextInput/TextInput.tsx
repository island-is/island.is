import { FormSystemField } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'
import { Dispatch, useState } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const TextInput = ({ item, dispatch }: Props) => {
  const { fieldSettings } = item
  const [value, setValue] = useState<string>(getValue(item, 'text') ?? '')
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(e.target.value)
    if (!dispatch) return
    dispatch({
      type: 'SET_TEXT',
      payload: {
        id: item.id,
        value: e.target.value,
      },
    })
  }

  return (
    <Input
      label={item?.name?.is ?? ''}
      name="text"
      textarea={fieldSettings?.isLarge ?? false}
      required={item.isRequired ?? false}
      backgroundColor="blue"
      value={value}
      onChange={handleChange}
    />
  )
}
