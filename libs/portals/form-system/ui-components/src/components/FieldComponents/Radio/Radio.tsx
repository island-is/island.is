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

  // The reducer/dependency logic elsewhere compares against label.is,
  // so keep the stored value consistent with that.
  const selected = useMemo(
    () => item?.list?.find((listItem) => listItem?.isSelected === true),
    [item?.list],
  )

  const defaultSelectedValue =
    getValue(item, 'listValue', valueIndex) ?? selected?.label?.is ?? ''

  const fieldName = `${item.id}.${valueIndex}`

  useEffect(() => {
    if (!dispatch) return
    if (!selected) return

    const existing = getValue(item, 'listValue', valueIndex)
    if (existing) return

    const seededValue = selected.label?.is ?? ''
    if (!seededValue) return

    dispatch({
      type: 'SET_LIST_VALUE',
      payload: { id: item.id, value: seededValue, valueIndex },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={fieldName}
      control={control}
      defaultValue={defaultSelectedValue}
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
              const rbValue = rb.label?.is ?? ''

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
                      payload: { id: item.id, value: rbValue, valueIndex },
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
                        payload: { id: item.id, value: rbValue, valueIndex },
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
