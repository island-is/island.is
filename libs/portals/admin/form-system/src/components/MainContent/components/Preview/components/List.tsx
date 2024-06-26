import { FormSystemInput, FormSystemListItem } from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import { Select } from '@island.is/island-ui/core'
import {
  useFormSystemGetCountriesLazyQuery,
  useFormSystemGetMunicipalitiesLazyQuery,
  useFormSystemGetZipCodesLazyQuery,
  useFormSystemGetTradesProfessionsLazyQuery,
} from './getLists.generated'

interface Props {
  currentItem: FormSystemInput
}

type ListItem = {
  label: string
  value: string | number
}

const ListTypePlaceholder = {
  lond: 'Veldu land',
  sveitarfelog: 'Veldu sveitarfélag',
  postnumer: 'Veldu póstnúmer',
  idngreinarMeistara: 'Veldu iðngrein',
}

export const List = ({ currentItem }: Props) => {
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [getCountries] = useFormSystemGetCountriesLazyQuery()
  const [getMunicipalities] = useFormSystemGetMunicipalitiesLazyQuery()
  const [getZipCodes] = useFormSystemGetZipCodesLazyQuery()
  const [getTradesProfessions] = useFormSystemGetTradesProfessionsLazyQuery()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapToListItems = (items: any[]): ListItem[] =>
    items?.map(item => ({
      label: item?.label?.is ?? '',
      value: item?.label?.is ?? '',
    })) ?? []

  const fetchAndSetList = async (fetcher: () => Promise<any>, dataKey: string) => {
    try {
      const { data } = await fetcher()
      if (!data || !data[dataKey] || !data[dataKey].list) {
        throw new Error(`Invalid data structure for ${dataKey}`)
      }
      setListItems(mapToListItems(data[dataKey].list))
    } catch (err) {
      console.error(`Error fetching ${dataKey}:`, err)
      setListItems([])
    }
  }

  useEffect(() => {
    const type = currentItem.inputSettings?.listType

    if (type === 'customList' || type === '') {
      const currentList = currentItem.inputSettings?.list ?? []
      setListItems(mapToListItems(currentList))
    } else {
      const fetchMap: Record<string, () => Promise<void>> = {
        'lond': () => fetchAndSetList(getCountries, 'formSystemGetCountries'),
        'sveitarfelog': () => fetchAndSetList(getMunicipalities, 'formSystemGetMunicipalities'),
        'postnumer': () => fetchAndSetList(getZipCodes, 'formSystemGetZipCodes'),
        'idngreinarMeistara': () => fetchAndSetList(getTradesProfessions, 'formSystemGetTradesProfessions'),
      }

      const fetcher = fetchMap[type]
      if (fetcher) {
        fetcher()
      } else {
        setListItems([])
      }
    }
  }, [
    currentItem.inputSettings?.list,
    currentItem.inputSettings?.listType,
    getCountries,
    getMunicipalities,
    getZipCodes,
    getTradesProfessions,
  ])

  return (
    <>
      <Select
        name="list"
        label={currentItem?.name?.is ?? ''}
        options={listItems}
        required={currentItem?.isRequired ?? false}
        placeholder={
          ListTypePlaceholder[
          currentItem.inputSettings?.listType as keyof typeof ListTypePlaceholder
          ] ?? 'Select an option'
        }
      />
    </>
  )
}
