import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib/reducerTypes'
import { Controller, useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  valueIndex?: number
}

type ListItem = {
  label: string
  value: object
}

const listTypePlaceholder = {
  lond: 'Veldu land',
  sveitarfelog: 'Veldu sveitarfélag',
  postnumer: 'Veldu póstnúmer',
}

export const List = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger } = useFormContext()

  const mapToListItems = (items: (FormSystemListItem | null)[]): ListItem[] =>
    items
      ?.filter((item): item is FormSystemListItem => item !== null)
      .map((item) => ({
        label: item.label?.[lang] ?? '',
        value: { label: item.label, value: item.value },
      })) ?? []

  const value = () => {
    const storedLabel = getValue(item, 'label', valueIndex)
    const storedValue = getValue(item, 'value', valueIndex)
    const hasValue =
      storedLabel !== undefined &&
      storedLabel !== null &&
      storedValue !== undefined &&
      storedValue !== null

    if (!hasValue) return undefined

    return {
      label: storedLabel?.[lang] ?? '',
      value: { label: storedLabel, value: storedValue },
    }
  }

  const selected = item?.list?.find((listItem) => listItem?.isSelected === true)

  useEffect(() => {
    if (selected && dispatch) {
      if (!getValue(item, 'label', valueIndex)) {
        dispatch({
          type: 'SET_LIST_VALUE',
          payload: {
            id: item.id,
            value: { label: selected.label, value: selected.value },
            valueIndex,
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'label', valueIndex)?.[lang] ?? ''}
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
      render={({ field, fieldState }) => (
        <Select
          name="list"
          label={item.name?.[lang] ?? ''}
          options={mapToListItems(item?.list ?? [])}
          required={item.isRequired ?? false}
          defaultValue={
            selected
              ? {
                  label: selected.label?.[lang] ?? '',
                  value: { label: selected.label, value: selected.value },
                }
              : undefined
          }
          placeholder={
            listTypePlaceholder[
              item.fieldSettings?.listType as keyof typeof listTypePlaceholder
            ] ?? formatMessage(m.select)
          }
          backgroundColor="blue"
          onChange={(e) => {
            field.onChange(e)
            trigger(field.name)
            if (!dispatch) return
            dispatch({
              type: 'SET_LIST_VALUE',
              payload: {
                id: item.id,
                value: e?.value,
                valueIndex,
              },
            })
          }}
          value={value()}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  )
}
