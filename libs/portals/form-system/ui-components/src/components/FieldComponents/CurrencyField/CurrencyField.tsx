import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

export const CurrencyField = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { formatMessage, lang } = useLocale()
  const label = item?.name?.[lang]
  const { control } = useFormContext()

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Controller
          key={`${item.id}-${valueIndex}`}
          name={`${item.id}.${valueIndex}`}
          control={control}
          defaultValue={getValue(item, 'iskNumber', valueIndex) ?? ''}
          rules={{
            required: {
              value: item?.isRequired ?? false,
              message: formatMessage(m.required),
            },
            pattern: {
              value: /^\d{1,3}(\.\d{3})*$/,
              message: formatMessage(m.onlyNumbers),
            },
          }}
          render={({ field, fieldState }) => (
            <Input
              label={label ?? ''}
              name={field.name}
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
                      valueIndex,
                    },
                  })
                }
              }}
              onBlur={() => {
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
