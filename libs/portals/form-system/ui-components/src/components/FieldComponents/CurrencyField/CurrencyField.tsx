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
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const CurrencyField = ({ item, dispatch }: Props) => {
  const label = item?.name?.is
  const { control } = useFormContext()
  const { formatMessage } = useIntl()

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
              message: formatMessage(m.required),
            },
            pattern: {
              value: /^[\d.]{1,19}$/,
              message: formatMessage(m.onlyNumbers),
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
                const formattedValue = inputValue.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  '.',
                )
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
                field.onBlur()
              }}
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
