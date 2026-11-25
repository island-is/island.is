import { FormSystemField } from '@island.is/api/schema'
import {
  Box,
  Checkbox as CheckboxField,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { useIntl } from 'react-intl'
import { FieldTooltip } from '../FieldTooltip'
import * as styles from './Checkbox.css'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

export const Checkbox = ({ item, valueIndex = 0, dispatch }: Props) => {
  const { control, trigger } = useFormContext()
  const { formatMessage } = useIntl()
  const { fieldSettings } = item
  const { isLarge, subLabel } = fieldSettings ?? {}
  const { lang } = useLocale()
  const tooltipText = item.tooltip?.[lang]?.trim()
  const tooltip = tooltipText ? <FieldTooltip text={tooltipText} /> : undefined
  const subLabelText = isLarge ? subLabel?.[lang]?.trim() : undefined

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
        <>
          <Box
            display="flex"
            alignItems="center"
            borderWidth={isLarge ? 'standard' : undefined}
            borderColor={isLarge ? 'blue200' : undefined}
            borderRadius={isLarge ? 'large' : undefined}
            paddingX={isLarge ? [2, 3] : undefined}
            paddingY={isLarge ? 3 : undefined}
          >
            <Box className={styles.control}>
              <CheckboxField
                name={field.name}
                ariaLabel={[item.name?.[lang], subLabelText]
                  .filter(Boolean)
                  .join(' ')}
                checked={field.value ?? false}
                onChange={(e) => {
                  field.onChange(e.target.checked)
                  if (dispatch) {
                    dispatch({
                      type: 'SET_CHECKBOX_VALUE',
                      payload: {
                        id: item.id,
                        value: e.target.checked,
                        valueIndex,
                      },
                    })
                  }
                  trigger(item.id)
                }}
                hasError={!!fieldState.error}
              />
            </Box>
            <Box marginLeft={2} flexGrow={1}>
              <Text fontWeight={field.value ? 'semiBold' : 'regular'}>
                {item.name?.[lang] ?? ''}
                {item.isRequired && (
                  <Text as="span" fontWeight="regular" color="red600">
                    {' '}
                    *
                  </Text>
                )}
              </Text>
              {subLabelText && (
                <Text
                  marginTop="smallGutter"
                  variant="small"
                  fontWeight="regular"
                >
                  {subLabelText}
                </Text>
              )}
            </Box>
            {tooltip}
          </Box>
          {fieldState.error && (
            <Box marginTop={1} aria-live="assertive">
              <InputError
                id={`${field.name}-error`}
                errorMessage={fieldState.error.message}
              />
            </Box>
          )}
        </>
      )}
    />
  )
}
