import { mapIsToEn, sorting } from '../../utils/helpers'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { Area, SortOptions } from '../../types/enums'
import DropdownSort from './components/DropdownSort'
import { SubscriptionArray } from '../../types/interfaces'
import { DebouncedSearch } from '../../components'
import cn from 'classnames'
import * as styles from './SearchAndSort.css'
import { useIsMobile } from '../../hooks'
import localization from './SearchAndSort.json'

interface Props {
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  searchValue: string
  setSearchValue: (str: string) => void
  sortTitle: SortOptions
  setSortTitle: (val: SortOptions) => void
  currentTab: Area
}

const SearchAndSort = ({
  subscriptionArray,
  setSubscriptionArray,
  searchValue,
  setSearchValue,
  sortTitle,
  setSortTitle,
  currentTab,
}: Props) => {
  const { isMobile } = useIsMobile()
  const loc = localization.searchAndSort
  const sortOpts = [
    {
      title: SortOptions.latest,
    },
    {
      title: SortOptions.aToZ,
    },
    {
      title: SortOptions.oldest,
    },
  ]

  const onChange = (newTitle: SortOptions) => {
    const subArrCopy = { ...subscriptionArray }
    const thisData = [...subscriptionArray[mapIsToEn[currentTab]]]
    const sortedData = sorting(thisData, newTitle)
    subArrCopy[mapIsToEn[currentTab]] = sortedData
    setSortTitle(newTitle)
    setSubscriptionArray(subArrCopy)
  }

  if (currentTab !== Area.case) {
    return (
      <GridRow>
        <GridColumn span={'12/12'}>
          <DebouncedSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            name="subscriptions_search"
            isSubscriptions
          />
        </GridColumn>
      </GridRow>
    )
  }

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '8/12', '9/12', '10/12']}>
        <DebouncedSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          name="subscriptions_search"
          isSubscriptions
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
              setTitle={(newTitle: SortOptions) => onChange(newTitle)}
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
              setTitle={(newTitle: SortOptions) => onChange(newTitle)}
            />
          </div>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default SearchAndSort
