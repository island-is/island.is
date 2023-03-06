import { Box, Button } from '@island.is/island-ui/core'
import { Area, SortOptions } from '../../types/enums'
import { ArrOfIdAndName, Case, SubscriptionArray } from '../../types/interfaces'
import SearchAndSort from '../SearchAndSort/SearchAndSort'
import SubscriptionTable from '../Table/SubscriptionTable'

export interface TabContentProps {
  data: Array<Case> | Array<ArrOfIdAndName>
  setData: (arr: Array<any>) => void
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (obj: SubscriptionArray) => void
  searchValue: string
  setSearchValue: (str: string) => void
  sortTitle: SortOptions
  setSortTitle: (val: SortOptions) => void
}

export const TabContent = ({
  data,
  setData,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  searchValue,
  setSearchValue,
  sortTitle,
  setSortTitle,
}: TabContentProps) => {
  const onLoadMore = () => {
    console.log('clicked on load more')
  }

  return (
    <Box paddingTop={[3, 3, 3, 5, 5]}>
      <SearchAndSort
        data={data}
        setData={setData}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
      />
      <SubscriptionTable
        data={data}
        currentTab={currentTab}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
      />
      <Box paddingY={3}>
        <Button icon="eye" variant="text" onClick={onLoadMore}>
          Sýna fleiri mál
        </Button>
      </Box>
    </Box>
  )
}

export default TabContent
