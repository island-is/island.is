import { Box } from '@island.is/island-ui/core'
import { Area, SortOptions } from '../../../../types/enums'
import { SubscriptionArray } from '../../../../types/interfaces'
import { SearchAndSort } from '../../../../components'
import { SubscriptionTable } from '../../components'

interface Props {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  searchValue: string
  setSearchValue: (str: string) => void
  sortTitle: SortOptions
  setSortTitle: (val: SortOptions) => void
  dontShowNew?: boolean
  dontShowChanges?: boolean
  isMySubscriptions?: boolean
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
  isMySubscriptions,
}: Props) => {
  return (
    <Box paddingTop={[3, 3, 3, 5, 5]} dataTestId="tab-content">
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
        {subscriptionArray && (
          <SubscriptionTable
            currentTab={currentTab}
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
            dontShowNew={dontShowNew}
            dontShowChanges={dontShowChanges}
            searchValue={searchValue}
            isMySubscriptions={isMySubscriptions}
          />
        )}
      </Box>
    </Box>
  )
}

export default TabContent
