import { FormSystemField, FormSystemFieldSettings } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const Checkbox = ({ item, dispatch }: Props) => {
  const { control } = useFormContext()
  const { formatMessage } = useIntl()
  const { fieldSettings } = item
  const { isLarge, hasDescription } = fieldSettings as FormSystemFieldSettings
  const { lang } = useLocale()
  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'checkboxValue') ?? false}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
      render={({ field, fieldState }) => (
        <CheckboxField
          name={field.name}
          label={item?.name?.[lang] ?? ''}
          large={isLarge ?? false}
          subLabel={hasDescription ? item?.description?.[lang] ?? '' : ''}
          required={item?.isRequired ?? false}
          checked={getValue(item, 'checkboxValue') ?? false}
          onChange={(e) => {
            field.onChange(e.target.checked)
            if (dispatch) {
              dispatch({
                type: 'SET_CHECKBOX_VALUE',
                payload: { id: item.id, value: e.target.checked },
              })
            }
          }}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error ? fieldState.error.message : undefined}
        />
      )}
    />
  )
}
