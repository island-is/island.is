import { Box } from '@island.is/island-ui/core'
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
  return (
    <Box paddingTop={[3, 3, 3, 5, 5]}>
      <SearchAndSort
        data={data}
        setData={setData}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        currentTab={currentTab}
      />
      <SubscriptionTable
        data={data}
        currentTab={currentTab}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
      />
    </Box>
  )
}

export default TabContent
