import { FormSystemField } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  onErrorChange?: (fieldId: string, hasError: boolean) => void
}

export const TextInput = ({ item, dispatch, onErrorChange }: Props) => {
  const { fieldSettings } = item
  const { control } = useFormContext()

  return (
    <Controller
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'text') ?? ''}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: 'Þessi reitur má ekki vera tómur',
        },
      }}
      render={({ field, fieldState }) => (
        <Input
          label={item?.name?.is ?? ''}
          name={field.name}
          textarea={fieldSettings?.isLarge ?? false}
          required={item.isRequired ?? false}
          backgroundColor="blue"
          value={field.value}
          onChange={(e) => {
            field.onChange(e)
            if (dispatch) {
              dispatch({
                type: 'SET_TEXT',
                payload: {
                  id: item.id,
                  value: e.target.value,
                },
              })
            }
          }}
          onBlur={(e) => {
            // Check for null or empty and trigger validation
            if (e.target.value === null || e.target.value === '') {
              field.onChange('') // Ensure value is empty string for validation
            }
            field.onBlur()
            if (onErrorChange) {
              onErrorChange(item.id, !!fieldState.error)
            }
          }}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  )
}
