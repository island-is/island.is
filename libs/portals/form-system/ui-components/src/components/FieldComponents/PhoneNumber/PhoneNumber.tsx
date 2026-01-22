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
}

const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/

export const PhoneNumber = ({ item, dispatch }: Props) => {
  const { locale, formatMessage, lang } = useLocale()
  const { control } = useFormContext()

  return (
    <Row>
      <Column>
        <Controller
          key={item.id}
          name={`${item.id}.phoneNumber`}
          control={control}
          defaultValue={getValue(item, 'phoneNumber') ?? ''}
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
          render={({ field, fieldState }) => (
            <PhoneInput
              label={item.name?.[lang] ?? ''}
              placeholder={formatMessage(m.phoneNumber)}
              name={field.name}
              locale={locale as Locale}
              required={item.isRequired ?? false}
              backgroundColor="blue"
              value={field.value}
              onChange={(e) => {
                field.onChange(e)
                if (dispatch) {
                  dispatch({
                    type: 'SET_PHONE_NUMBER',
                    payload: {
                      id: item.id,
                      value: e.target.value,
                    },
                  })
                }
              }}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
    </Row>
  )
}
