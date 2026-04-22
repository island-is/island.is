import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import {
  Box,
  Inline,
  InputError,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

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
          <Inline space={1}>
            <Text variant="h4">{item?.name?.[lang]}</Text>
            {item?.isRequired && (
              <Text variant="h4" as="span">
                *
              </Text>
            )}
          </Inline>

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
                  width="half"
                  padding={1}
                  onClick={() => {
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
                  key={rb.id ?? `${item.id}-${valueIndex}-${index}`}
                >
                  <RadioButton
                    label={rb?.label?.[lang]}
                    tooltip={
                      rb?.description?.is && rb?.description?.[lang] !== ''
                        ? rb?.description?.[lang]
                        : undefined
                    }
                    large
                    backgroundColor="blue"
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
              )
            })}
          </Box>
        </>
      )}
    />
  )
}
