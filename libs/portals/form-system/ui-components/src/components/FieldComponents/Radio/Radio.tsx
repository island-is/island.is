import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { Box, InputError, RadioButton, Text } from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { FieldTooltip } from '../FieldTooltip'
import * as styles from './Radio.css'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  valueIndex?: number
}

export const Radio = ({ item, dispatch, hasError, valueIndex = 0 }: Props) => {
  const { formatMessage, lang } = useLocale()
  const { control, trigger } = useFormContext()

  const radioButtons = useMemo(
    () => (item.list as FormSystemListItem[]) ?? [],
    [item.list],
  )

  const selected = item?.list?.find((listItem) => listItem?.isSelected === true)

  const fieldName = `${item.id}.${valueIndex}`

  useEffect(() => {
    if (!dispatch || !selected) return

    const existing = getValue(item, 'label', valueIndex)
    if (existing) return

    dispatch({
      type: 'SET_LIST_VALUE',
      payload: {
        id: item.id,
        value: { label: selected.label, value: selected.value },
        valueIndex,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedLabel = selected?.label?.[lang] ?? ''

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={fieldName}
      control={control}
      defaultValue={
        getValue(item, 'label', valueIndex)?.[lang] ?? selectedLabel
      }
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
      render={({ field, fieldState }) => (
        <>
          <Text variant="h4">
            {item?.name?.[lang]}
            {item?.isRequired && (
              <Text variant="h4" as="span" fontWeight="medium" color="red600">
                {'\u00a0*'}
              </Text>
            )}
          </Text>

          {(hasError || fieldState.error) && (
            <InputError
              errorMessage={
                fieldState.error?.message ?? formatMessage(m.basicErrorMessage)
              }
            />
          )}

          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {radioButtons.map((rb, index) => {
              const rbValue = rb.label?.[lang] ?? ''

              return (
                <Box
                  className={styles.option}
                  padding={1}
                  key={rb.id ?? `${item.id}-${valueIndex}-${index}`}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    background="blue100"
                    borderWidth="standard"
                    borderColor="blue200"
                    borderRadius="large"
                    paddingX={[2, 3]}
                    paddingY={3}
                  >
                    <Box className={styles.control}>
                      <RadioButton
                        name={field.name}
                        id={`${field.name}-${rb.id ?? index}`}
                        value={rbValue}
                        label={
                          <span className={helperStyles.srOnly}>
                            {rb.label?.[lang]}
                          </span>
                        }
                        checked={field.value === rbValue}
                        onChange={() => {
                          field.onChange(rbValue)
                          trigger(field.name)

                          if (!dispatch) return
                          dispatch({
                            type: 'SET_LIST_VALUE',
                            payload: {
                              id: item.id,
                              value: { label: rb.label, value: rb.value },
                              valueIndex,
                            },
                          })
                        }}
                      />
                    </Box>
                    <Box marginLeft={2} flexGrow={1}>
                      <Text
                        fontWeight={
                          field.value === rbValue ? 'semiBold' : 'light'
                        }
                      >
                        {rb.label?.[lang]}
                      </Text>
                    </Box>
                    <FieldTooltip
                      text={
                        rb.description?.is && rb.description?.[lang] !== ''
                          ? rb.description?.[lang]
                          : undefined
                      }
                    />
                  </Box>
                </Box>
              )
            })}
          </Box>
        </>
      )}
    />
  )
}
