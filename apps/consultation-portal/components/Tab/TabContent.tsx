import { Box, Text } from '@island.is/island-ui/core'
import { Area, SortOptions } from '../../types/enums'
import { SubscriptionArray } from '../../types/interfaces'
import SearchAndSort from '../SearchAndSort/SearchAndSort'
import SubscriptionTable from '../Table/SubscriptionTable'

export interface TabContentProps {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  searchValue: string
  setSearchValue: (str: string) => void
  sortTitle: SortOptions
  setSortTitle: (val: SortOptions) => void
  dontShowNew?: boolean
  dontShowChanges?: boolean
}

export const TabContent = ({
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  searchValue,
  setSearchValue,
  sortTitle,
  setSortTitle,
  dontShowNew,
  dontShowChanges,
}: TabContentProps) => {
  return (
    <Box paddingTop={[3, 3, 3, 5, 5]}>
      <SearchAndSort
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        currentTab={currentTab}
      />
      <Box paddingTop={[3, 3, 3, 5, 5]}>
        {subscriptionArray ? (
          <SubscriptionTable
            currentTab={currentTab}
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
            dontShowNew={dontShowNew}
            dontShowChanges={dontShowChanges}
          />
        ) : (
          <Text variant="h4">
            {searchValue
              ? 'Engin áskrift fannst. Prófaðu að hreinsa úr leit til að sjá áskriftir.'
              : 'Engin áskrift fannst.'}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default TabContent
