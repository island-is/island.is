import { FormSystemField } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  PhoneInput,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { Dispatch } from 'react'
import { Action, m } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { Locale } from '@island.is/shared/types'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
}

const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/

export const PhoneNumber = ({ item, dispatch, lang = 'is' }: Props) => {
  const { locale, formatMessage } = useIntl()
  const { control } = useFormContext()

  return (
    <Row>
      <Column>
        <Controller
          name={item.id}
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
