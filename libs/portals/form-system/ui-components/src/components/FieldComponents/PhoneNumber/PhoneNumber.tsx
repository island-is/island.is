import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  PhoneInput,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action, m } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/

export const PhoneNumber = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { locale, formatMessage, lang } = useLocale()
  const { control } = useFormContext()

  return (
    <Row>
      <Column>
        <Controller
          key={`${item.id}-${valueIndex}`}
          name={`${item.id}.${valueIndex}`}
          control={control}
          defaultValue={getValue(item, 'phoneNumber', valueIndex) ?? ''}
          rules={{
            required: {
              value: item.isRequired ?? false,
              message: formatMessage(m.required),
            },
            pattern: {
              value: PHONE_REGEX,
              message: formatMessage(m.invalidPhoneNumber),
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <PhoneInput
                label={item.name?.[lang] ?? ''}
                placeholder={formatMessage(m.phoneNumber)}
                name={field.name}
                locale={locale as Locale}
                required={item.isRequired ?? false}
                backgroundColor="blue"
                value={field.value}
                onFormatValueChange={(formattedValue: string) => {
                  // This is the full value PhoneInput constructs (e.g. "+3545812345")
                  field.onChange(formattedValue)
                  dispatch?.({
                    type: 'SET_PHONE_NUMBER',
                    payload: {
                      id: item.id,
                      value: formattedValue,
                      valueIndex,
                    },
                  })
                }}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
              />
            )
          }}
        />
      </Column>
    </Row>
  )
}
