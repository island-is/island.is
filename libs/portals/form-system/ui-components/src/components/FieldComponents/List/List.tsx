import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { Dispatch } from 'react'
import { Select } from '@island.is/island-ui/core'
import { Action } from '../../../lib/reducerTypes'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
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

export const List = ({ item, dispatch, lang = 'is', hasError }: Props) => {
  const mapToListItems = (items: (FormSystemListItem | null)[]): ListItem[] =>
    items?.filter((item): item is FormSystemListItem => item !== null)
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

  return (
    <Select
      name="list"
      label={item.name?.[lang] ?? ''}
      options={mapToListItems(item?.list ?? [])}
      required={item.isRequired ?? false}
      placeholder={
        listTypePlaceholder[
        item.fieldSettings?.listType as keyof typeof listTypePlaceholder
        ] ?? 'Select an option'
      }
      backgroundColor="blue"
      onChange={(e) => {
        if (!dispatch) return
        dispatch({
          type: 'SET_LIST_VALUE',
          payload: { id: item.id, value: e?.value },
        })
      }}
      value={value()}
      hasError={!!hasError}
    />
  )
}
