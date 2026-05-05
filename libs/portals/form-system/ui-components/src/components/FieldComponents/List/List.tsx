import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { ListTypesEnum } from '@island.is/form-system/enums'
import { Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getValue } from '../../../lib/getValue'
import { countriesAsListItems } from '../../../lib/lists/countries.list'
import { getCurrenciesList } from '../../../lib/lists/currencies.list'
import { getMunicipalitiesList } from '../../../lib/lists/municipalities.list'
import { getPostalCodesList } from '../../../lib/lists/postalCodes.list'
import { m } from '../../../lib/messages'
import { Action } from '../../../lib/reducerTypes'

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
  [ListTypesEnum.COUNTRIES]: 'Veldu land',
  [ListTypesEnum.MUNICIPALITIES]: 'Veldu sveitarfélag',
  [ListTypesEnum.POSTAL_CODES]: 'Veldu póstnúmer',
  [ListTypesEnum.CURRENCIES]: 'Veldu gjaldmiðil',
} as const

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

  const listByType = () => {
    switch (item.fieldSettings?.listType) {
      case ListTypesEnum.COUNTRIES:
        return countriesAsListItems()
      case ListTypesEnum.MUNICIPALITIES:
        return getMunicipalitiesList()
      case ListTypesEnum.POSTAL_CODES:
        return getPostalCodesList()
      case ListTypesEnum.CURRENCIES:
        return getCurrenciesList()
      default:
        return item.list ?? []
    }
  }

  const resolvedList = listByType()

  const selected = resolvedList?.find(
    (listItem) => listItem?.isSelected === true,
  )

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

  const placeholder =
    item.fieldSettings?.listType &&
    item.fieldSettings.listType in listTypePlaceholder
      ? listTypePlaceholder[
          item.fieldSettings.listType as keyof typeof listTypePlaceholder
        ]
      : formatMessage(m.select)

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
          options={mapToListItems(resolvedList)}
          required={item.isRequired ?? false}
          defaultValue={
            selected
              ? {
                  label: selected.label?.[lang] ?? '',
                  value: { label: selected.label, value: selected.value },
                }
              : undefined
          }
          placeholder={placeholder}
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
