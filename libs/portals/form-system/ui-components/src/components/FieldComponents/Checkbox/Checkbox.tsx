import { FormSystemField, FormSystemFieldSettings } from '@island.is/api/schema'
import { Checkbox as CheckboxField, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

export const Checkbox = ({ item, valueIndex = 0, dispatch }: Props) => {
  const { control, trigger } = useFormContext()
  const { formatMessage } = useIntl()
  const { fieldSettings } = item
  const { isLarge, hasDescription } = fieldSettings as FormSystemFieldSettings
  const { lang } = useLocale()

  const label = (
    <Text>
      {item?.name?.[lang] ?? ''}
      {item.isRequired && (
        <Text as="span" fontWeight="regular" color="red600">
          {' '}
          *
        </Text>
      )}
    </Text>
  )

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={`${item.id}.${valueIndex}`}
      control={control}
      defaultValue={getValue(item, 'checkboxValue', valueIndex) ?? false}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
      render={({ field, fieldState }) => (
        <CheckboxField
          name={field.name}
          label={label}
          large={isLarge ?? false}
          subLabel={hasDescription ? item?.description?.[lang] ?? '' : ''}
          checked={field.value ?? false}
          onChange={(e) => {
            field.onChange(e.target.checked)
            if (dispatch) {
              dispatch({
                type: 'SET_CHECKBOX_VALUE',
                payload: { id: item.id, value: e.target.checked, valueIndex },
              })
            }
            trigger(item.id)
          }}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error ? fieldState.error.message : undefined}
        />
      )}
    />
  )
}
