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

  useEffect(() => {
    const type = currentItem.inputSettings?.listType
    if (type === 'customList' || type === '') {
      const currentList = currentItem.inputSettings?.list ?? []
      setListItems(
        currentList.map((l: FormSystemListItem) => ({
          label: l?.label?.is ?? '',
          value: l?.label?.is ?? '',
        })),
      )
    } else {
      const fetchList = async () => {
        let data, loading, error
        switch (type) {
          case 'lond':
            ;({ data, loading, error } = await getCountries())
            setListItems(
              data?.formSystemGetCountries?.list?.map((c) => ({
                label: c?.label?.is ?? '',
                value: c?.label?.is ?? '',
              })) ?? [],
            )
            break
          case 'sveitarfelog':
            ;({ data, loading, error } = await getMunicipalities())
            setListItems(
              data?.formSystemGetMunicipalities.list?.map((m) => ({
                label: m?.label?.is ?? '',
                value: m?.label?.is ?? '',
              })) ?? [],
            )
            break
          case 'postnumer':
            ;({ data, loading, error } = await getZipCodes())
            setListItems(
              data?.formSystemGetZipCodes.list?.map((z) => ({
                label: z?.label?.is ?? '',
                value: z?.label?.is ?? '',
              })) ?? [],
            )
            break
          case 'idngreinarMeistara':
            ;({ data, loading, error } = await getTradesProfessions())
            setListItems(
              data?.formSystemGetTradesProfessions.list?.map((t) => ({
                label: t?.label?.is ?? '',
                value: t?.label?.is ?? '',
              })) ?? [],
            )
            break
          default:
            break
        }
      }
      fetchList()
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
            currentItem.inputSettings
              ?.listType as keyof typeof ListTypePlaceholder
          ]
        }
      />
    </>
  )
}
