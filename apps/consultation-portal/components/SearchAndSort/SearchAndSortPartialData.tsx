import { AdviceFilter } from '../../types/interfaces'
import {
  AsyncSearch,
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import DropdownSort from '../DropdownSort/DropdownSort'
import { SortOptionsAdvices } from '../../types/enums'

interface Props {
  filters: AdviceFilter
  setFilters: (arr: AdviceFilter) => void
  loading?: boolean
}

const SearchAndSortPartialData = ({ filters, setFilters, loading }: Props) => {
  const searchOptions = []
  const [searchValue, setSearchValue] = useState(filters?.searchQuery)
  const [sortTitle, setSortTitle] = useState(
    filters?.oldestFirst
      ? SortOptionsAdvices.oldest
      : SortOptionsAdvices.latest,
  )

  const sortOpts = [
    {
      title: SortOptionsAdvices.latest,
    },
    {
      title: SortOptionsAdvices.oldest,
    },
  ]

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

  useEffect(() => {
    const filtersCopy = { ...filters }
    filtersCopy.oldestFirst = !filtersCopy.oldestFirst
    setFilters(filtersCopy)
  }, [sortTitle, setSortTitle])

  return (
    <>
      <Hidden above={'sm'}>
        <Box paddingBottom={1}>
          <Text variant="eyebrow">Leit og röðun</Text>
        </Box>
      </Hidden>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '8/12', '9/12', '10/12']}>
          <Stack space={1}>
            <Hidden below="md">
              <Text variant="eyebrow">Leit</Text>
            </Hidden>
            <AsyncSearch
              label="Leit"
              colored={true}
              options={searchOptions}
              placeholder="Að hverju ertu að leita?"
              initialInputValue={searchValue}
              inputValue={searchValue}
              onInputValueChange={(value) => setSearchValue(value)}
            />
            <Hidden above="sm">
              <Box paddingTop={1}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle}
                  setTitle={(newTitle: SortOptionsAdvices) =>
                    setSortTitle(newTitle)
                  }
                />
              </Box>
            </Hidden>
          </Stack>
        </GridColumn>
        <GridColumn span={['0', '0', '4/12', '3/12', '2/12']}>
          <Hidden below="md">
            <Stack space={1}>
              <Text variant="eyebrow">Röðun</Text>
              <div style={{ zIndex: 1, position: 'relative' }}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle}
                  setTitle={(newTitle: SortOptionsAdvices) =>
                    setSortTitle(newTitle)
                  }
                />
              </div>
            </Stack>
          </Hidden>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default SearchAndSortPartialData
