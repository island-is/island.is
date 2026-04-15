import { FormSystemField } from '@island.is/api/schema'
import { Box, Input, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action, getValue, m } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const PaymentQuantity = ({ item, dispatch }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control } = useFormContext()

  const { isDropdown, minValue, maxValue } = item.fieldSettings
    ? item.fieldSettings
    : { isDropdown: false }

  const selectOptions = () => {
    const options = []
    for (let i = minValue || 1; i <= (maxValue || 100); i++) {
      options.push({ value: String(i), label: String(i) })
    }
    return options
  }

  const dropDownValue = () => {
    const listVal = getValue(item, 'number')
    const hasValue = listVal !== undefined && listVal !== null
    if (hasValue) {
      return {
        label: listVal,
        value: listVal,
      }
    }
    return undefined
  }

  return (
    <Box>
      <Controller
        key={item.id}
        name={`${item.id}.paymentQuantity`}
        control={control}
        defaultValue={getValue(item, 'number') ?? ''}
        rules={{
          required: {
            value: !item.isHidden,
            message: formatMessage(m.required),
          },
          min: {
            value: minValue || 1,
            message: formatMessage(m.minAmount, { minAmount: minValue || 1 }),
          },
          max: {
            value: maxValue || 100,
            message: formatMessage(m.maxAmount, { maxAmount: maxValue || 100 }),
          },
        }}
        render={({ field, fieldState }) =>
          isDropdown ? (
            <Select
              {...field}
              label={item.name?.[lang] ?? ''}
              backgroundColor="blue"
              options={selectOptions()}
              placeholder="Veldu fjölda"
              errorMessage={fieldState.error?.message}
              value={dropDownValue()}
              onChange={(e) => {
                field.onChange(e)
                if (dispatch) {
                  dispatch({
                    type: 'SET_PAYMENT_QUANTITY',
                    payload: {
                      id: item.id,
                      value: Number(e?.value),
                    },
                  })
                }
              }}
            />
          ) : (
            <Input
              {...field}
              label={item.name?.[lang] ?? ''}
              backgroundColor="blue"
              type="number"
              placeholder="Veldu fjölda"
              errorMessage={fieldState.error?.message}
              value={getValue(item, 'number') ?? ''}
              onChange={(e) => {
                field.onChange(e)
                if (dispatch) {
                  dispatch({
                    type: 'SET_PAYMENT_QUANTITY',
                    payload: {
                      id: item.id,
                      value: Number(e.target.value),
                    },
                  })
                }
              }}
            />
          )
        }
      />
    </Box>
  )
}
