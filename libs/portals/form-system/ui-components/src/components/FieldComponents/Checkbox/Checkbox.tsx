import { FormSystemField } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
}

export const Checkbox = ({ item, dispatch, lang = 'is' }: Props) => {
  const { control } = useFormContext()

  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'checkboxValue') ?? false}
      render={({ field }) => (
        <CheckboxField
          name={field.name}
          label={item?.name?.[lang] ?? ''}
          checked={getValue(item, 'checkboxValue') ?? false}
          onChange={(e) => {
            field.onChange(e.target.checked)
            if (dispatch) {
              dispatch({
                type: 'SET_CHECKBOX_VALUE',
                payload: { id: item.id, value: e.target.checked },
              })
            }
          }}
        />
      )}
    />
  )
}
