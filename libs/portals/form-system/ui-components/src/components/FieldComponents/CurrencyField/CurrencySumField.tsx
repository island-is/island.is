import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { ApplicationState } from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  state?: ApplicationState
}

export const CurrencySumField = ({ item, dispatch, state }: Props) => {
  const { currentScreen } = state || {}
  const { formatMessage, lang } = useLocale()
  const label = item?.name?.[lang]
  const { control } = useFormContext()
  console.log('currentScreen', currentScreen)

  console.log('item', item)
  if (!currentScreen) {
    return null
  }

  let sum = 0
  currentScreen.data?.fields?.forEach((field) => {
    if (field && field.fieldType === FieldTypesEnum.ISK_NUMBERBOX) {
      const value = getValue(field, 'iskNumber')
      if (value) {
        const numericValue = parseInt(value.replace(/\./g, ''), 10)
        if (!isNaN(numericValue)) {
          sum += numericValue
        }
      }
    }
  })

  const formattedSum = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  useEffect(() => {
    console.log('formattedSum', formattedSum)
    if (dispatch) {
      dispatch({
        type: 'SET_CURRENCY',
        payload: {
          value: formattedSum,
          id: item.id,
        },
      })
    }
  }, [formattedSum])

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Controller
          key={item.id}
          name={item.id}
          control={control}
          defaultValue={getValue(item, 'iskNumber') ?? ''}
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
              value={formattedSum}
              readOnly
              backgroundColor="blue"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
    </Row>
  )
}
