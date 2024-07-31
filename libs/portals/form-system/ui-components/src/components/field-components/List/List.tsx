import { FormSystemInput } from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import { Select } from '@island.is/island-ui/core'
import {
  useFormSystemGetCountriesLazyQuery,
  useFormSystemGetMunicipalitiesLazyQuery,
  useFormSystemGetZipCodesLazyQuery,
  useFormSystemGetTradesProfessionsLazyQuery,
} from './getLists.generated'

interface Props {
  item: FormSystemInput
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

export const List = ({ item }: Props) => {
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [getCountries] = useFormSystemGetCountriesLazyQuery()
  const [getMunicipalities] = useFormSystemGetMunicipalitiesLazyQuery()
  const [getZipCodes] = useFormSystemGetZipCodesLazyQuery()
  const [getTradesProfessions] = useFormSystemGetTradesProfessionsLazyQuery()

  const mapToListItems = (items: any[]): ListItem[] =>
    items?.map((item) => ({
      label: item?.label?.is ?? '',
      value: item?.label?.is ?? ''
    })) ?? []


  useEffect(() => {
    const type = item.inputSettings?.listType

    const fetchAndSetList = async (
      fetcher: () => Promise<any>,
      dataKey: string,
    ) => {
      try {
        const { data } = await fetcher()
        if (!data || !data[dataKey] || !data[dataKey].list) {
          throw new Error(`Invalid data structure for ${dataKey}`)
        }
        setListItems(mapToListItems(data[dataKey].list))
      } catch (error) {
        console.error(`Error fetching ${dataKey}:`, error)
      }
    }

    if (type === 'customList' || type === '') {
      const currentList = item.inputSettings?.list ?? []
      setListItems(mapToListItems(currentList))
    } else {
      const fetchMap: Record<string, () => Promise<void>> = {
        lond: () => fetchAndSetList(getCountries, 'formSystemGetCountries'),
        sveitarfelog: () =>
          fetchAndSetList(getMunicipalities, 'formSystemGetMunicipalities'),
        postnumer: () => fetchAndSetList(getZipCodes, 'formSystemGetZipCodes'),
        idngreinarMeistara: () =>
          fetchAndSetList(
            getTradesProfessions,
            'formSystemGetTradesProfessions',
          ),
      }

      const fetcher = fetchMap[type]
      if (fetcher) {
        fetcher()
      } else {
        setListItems([])
      }
    }
  }, [
    item.inputSettings?.list,
    item.inputSettings?.listType,
    getCountries,
    getMunicipalities,
    getZipCodes,
    getTradesProfessions,
  ])

  return (
    <Select
      name="list"
      label={item.name?.is ?? ''}
      options={listItems}
      required={item.isRequired ?? false}
      placeholder={
        listTypePlaceholder[
        item.inputSettings?.listType as keyof typeof listTypePlaceholder
        ] ?? 'Select an option'
      }
    />
  )
}
