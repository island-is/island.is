import { CaseFilter } from '../../types/interfaces'
import {
  Box,
  FilterInput,
  FilterMultiChoice,
  Filter,
  GridContainer,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { getItem, setItem } from '../../utils/helpers/localStorage'
import { FILTERS_FRONT_PAGE_KEY } from '../../utils/consts/consts'

interface Props {
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  total: number
  initialValues: CaseFilter
}

type FilterMultiChoiceChangeEvent = {
  /** Id of the category the selected values belongs to. */
  categoryId: string
  /** Array of selected items in the corresponding category. */
  selected: Array<string>
}

export const MobileFilter = ({
  filters,
  setFilters,
  total,
  initialValues,
}: Props) => {
  const [searchValue, setSearchValue] = useState(filters?.searchQuery)

  useEffect(() => {
    const identifier = setTimeout(() => {
      const filtersCopy = { ...filters }
      filtersCopy.searchQuery = searchValue
      setFilters(filtersCopy)
    }, 500)

    return () => {
      clearTimeout(identifier)
    }
  }, [searchValue, setSearchValue])

  const onChangeSearch = (value: string) => {
    setSearchValue(value)
  }

  const { caseStatuses, caseTypes } = filters

  const caseStatusesList = filters?.caseStatuses?.items
    .filter((item) => item.checked)
    .map((i) => i.value)

  const caseTypesList = filters?.caseTypes?.items
    .filter((item) => item.checked)
    .map((i) => i.value)

  const categories = [
    {
      id: 'caseStatuses',
      label: 'Staða máls',
      selected: caseStatusesList.map((item) => item.toString()),
      filters: caseStatuses.items,
    },
    {
      id: 'caseTypes',
      label: 'Tegund máls',
      selected: caseTypesList.map((item) => item.toString()),
      filters: caseTypes.items,
    },
  ]

  const handleOnClear = () => {
    getItem({ key: FILTERS_FRONT_PAGE_KEY, clear: true })
    setFilters(initialValues)
    setSearchValue('')
  }

  const handleOnCategoryClear = (categoryId: string) => {
    const filtersCopy = { ...filters }
    const thisData = filtersCopy[categoryId]

    const changedItems = thisData?.items.map((item) => {
      return {
        ...item,
        checked: false,
      }
    })
    thisData.items = changedItems
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const handleOnChange = (event: FilterMultiChoiceChangeEvent) => {
    const { categoryId, selected } = event
    const filtersCopy = { ...filters }
    const thisData = filtersCopy[categoryId]

    const changedItems = thisData?.items.map((item) => {
      if (selected.find((i) => i === item?.value)) {
        return (item = { ...item, checked: true })
      }
      return {
        ...item,
        checked: false,
      }
    })
    thisData.items = changedItems
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  return (
    <GridContainer>
      <Box paddingY="gutter">
        <Filter
          labelClearAll="Hreinsa allar síur"
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía"
          labelResult="Sýna niðurstöður"
          onFilterClear={handleOnClear}
          variant="dialog"
          resultCount={total}
          filterInput={
            <FilterInput
              name="filter-input"
              placeholder="Sía eftir leitarorði"
              value={searchValue}
              onChange={(value) => onChangeSearch(value)}
            />
          }
        >
          <FilterMultiChoice
            labelClear="Hreinsa val"
            categories={categories}
            onChange={(event) => handleOnChange(event)}
            onClear={(categoryId) => handleOnCategoryClear(categoryId)}
          />
        </Filter>
      </Box>
    </GridContainer>
  )
}

export default MobileFilter
