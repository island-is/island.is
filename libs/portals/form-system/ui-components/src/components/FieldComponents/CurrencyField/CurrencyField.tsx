import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { FormSystemField } from '@island.is/api/schema'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  onErrorChange?: (fieldId: string, hasError: boolean) => void
}

export const CurrencyField = ({ item, dispatch, onErrorChange }: Props) => {
  const label = item?.name?.is
  const { control } = useFormContext()

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Controller
          name={item.id}
          control={control}
          defaultValue={getValue(item, 'iskNumber') ?? ''}
          rules={{
            required: {
              value: item?.isRequired ?? false,
              message: 'Þessi reitur má ekki vera tómur',
            },
            pattern: {
              value: /^[\d.]{1,19}$/,
              message: 'Aðeins tölur og punktar eru leyfðir',
            },
          }}
          render={({ field, fieldState }) => (
            <Input
              label={label ?? ''}
              name="Currency"
              value={field.value}
              onChange={(e) => {
                // Remove any non-digit characters from the input value
                const inputValue = e.target.value.replace(/\D/g, '')
                // Split the input value into groups of three characters
                const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                field.onChange(formattedValue)
                if (dispatch) {
                  dispatch({
                    type: 'SET_CURRENCY',
                    payload: {
                      value: formattedValue,
                      id: item.id,
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
                  setTimeout(() => {
                    onErrorChange(item.id, !!fieldState.error)
                  }, 0)
                    }
                  }
                }
              required={item?.isRequired ?? false}
              backgroundColor="blue"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
    </Row>
  )
}
