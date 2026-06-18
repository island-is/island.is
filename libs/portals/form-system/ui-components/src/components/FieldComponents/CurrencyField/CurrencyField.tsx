import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

const formatCurrencyValue = (value: string) =>
  value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

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
            <NumberFormat
              customInput={Input}
              label={label ?? ''}
              name={field.name}
              value={field.value ?? ''}
              suffix=" kr."
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              type="text"
              inputMode="numeric"
              onValueChange={({ value }) => {
                const formattedValue = formatCurrencyValue(value)

                field.onChange(formattedValue)

                dispatch?.({
                  type: 'SET_CURRENCY',
                  payload: {
                    value: formattedValue,
                    id: item.id,
                    valueIndex,
                  },
                })
              }}
              onBlur={field.onBlur}
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
