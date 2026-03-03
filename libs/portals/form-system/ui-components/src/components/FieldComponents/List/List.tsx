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
}

type ListItem = {
  label: string
  value: string | number
}

const listTypePlaceholder = {
  lond: 'Veldu land',
  sveitarfelog: 'Veldu sveitarfélag',
  postnumer: 'Veldu póstnúmer',
  idngreinarMeistara: 'Veldu iðngrein',
}

export const List = ({ item, dispatch }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger } = useFormContext()

  const mapToListItems = (items: (FormSystemListItem | null)[]): ListItem[] =>
    items
      ?.filter((item): item is FormSystemListItem => item !== null)
      .map((item) => ({
        label: item.label?.[lang] ?? '',
        value: item.label?.[lang] ?? '',
      })) ?? []

  const value = () => {
    const listVal = item?.values?.[0]?.json?.listValue
    const hasValue = listVal !== undefined && listVal !== null
    if (hasValue) {
      return {
        label: listVal,
        value: listVal,
      }
    }
    return undefined
  }

  const selected = item?.list?.find((listItem) => listItem?.isSelected === true)

  useEffect(() => {
    if (selected && dispatch) {
      if (!getValue(item, 'listValue')) {
        dispatch({
          type: 'SET_LIST_VALUE',
          payload: { id: item.id, value: selected.label?.[lang] ?? '' },
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
      defaultValue={getValue(item, 'listValue') ?? ''}
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
                  value: selected.label?.[lang] ?? '',
                }
              : undefined
          }
          placeholder={
            listTypePlaceholder[
              item.fieldSettings?.listType as keyof typeof listTypePlaceholder
            ] ?? 'Select an option'
          }
          backgroundColor="blue"
          onChange={(e) => {
            field.onChange(e)
            trigger(field.name)
            if (!dispatch) return
            dispatch({
              type: 'SET_LIST_VALUE',
              payload: { id: item.id, value: e?.value },
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
