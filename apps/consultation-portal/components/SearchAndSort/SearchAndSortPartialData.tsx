import { AdviceFilter } from '../../types/interfaces'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import DropdownSort from './components/DropdownSort'
import { SortOptionsAdvices } from '../../types/enums'
import { useIsMobile } from '../../hooks'
import { DebouncedSearch } from '../../components'
import cn from 'classnames'
import * as styles from './SearchAndSort.css'
import { setItem } from '../../utils/helpers/localStorage'
import { FILTERS_ADVICE_KEY } from '../../utils/consts/consts'
import localization from './SearchAndSort.json'

interface Props {
  filters: AdviceFilter
  setFilters: (arr: AdviceFilter) => void
}

const SearchAndSortPartialData = ({ filters, setFilters }: Props) => {
  const { isMobile } = useIsMobile()
  const loc = localization.searchAndSortPartialData
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

  const onChange = (newTitle: SortOptionsAdvices) => {
    const isOldest = newTitle === SortOptionsAdvices.oldest ? true : false
    const filtersCopy = { ...filters }
    filtersCopy.oldestFirst = isOldest
    setItem({ key: FILTERS_ADVICE_KEY, value: filtersCopy })
    setSortTitle(newTitle)
    setFilters(filtersCopy)
  }

  useEffect(() => {
    setSortTitle(
      filters?.oldestFirst
        ? SortOptionsAdvices.oldest
        : SortOptionsAdvices.latest,
    )
  }, [filters])

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '8/12', '9/12', '10/12']}>
        <DebouncedSearch
          filters={filters}
          setFilters={setFilters}
          name="my_advices_search"
          localStorageId={FILTERS_ADVICE_KEY}
          label={
            isMobile
              ? loc.debouncedSearchLabel.mobile
              : loc.debouncedSearchLabel.notMobile
          }
        />
      </GridColumn>
      {isMobile ? (
        <GridColumn span={'12/12'}>
          <Box paddingTop={1}>
            <DropdownSort
              menuAriaLabel="sort by"
              items={sortOpts}
              icon="menu"
              title={sortTitle}
              setTitle={(newTitle: SortOptionsAdvices) => onChange(newTitle)}
            />
          </Box>
        </GridColumn>
      ) : (
        <GridColumn span={['0', '0', '4/12', '3/12', '2/12']}>
          <label className={cn(styles.label)}>{loc.label}</label>
          <div style={{ zIndex: 1, position: 'relative' }}>
            <DropdownSort
              menuAriaLabel="sort by"
              items={sortOpts}
              icon="menu"
              title={sortTitle}
              setTitle={(newTitle: SortOptionsAdvices) => onChange(newTitle)}
            />
          </div>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default SearchAndSortPartialData
