import { SortTitle, SubscriptionArray } from '../../../../types/interfaces'
import { TabContent } from './TabContent'
import { Area, SortOptions } from '../../../../types/enums'

interface Props {
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  searchValue: string
  setSearchValue: (_: string) => void
  sortTitle: SortTitle
  setSortTitle: (_: SortOptions) => void
  dontShowNew?: boolean
  dontShowChanges?: boolean
  isMySubscriptions?: boolean
}

const TabsList = ({
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
  return [
    {
      id: Area.case,
      label: Area.case,
      content: (
        <TabContent
          currentTab={Area.case}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.case]}
          setSortTitle={setSortTitle}
          dontShowNew={dontShowNew}
          dontShowChanges={dontShowChanges}
          isMySubscriptions={isMySubscriptions}
        />
      ),
      disabled: false,
    },
    {
      id: Area.institution,
      label: Area.institution,
      content: (
        <TabContent
          currentTab={Area.institution}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.institution]}
          setSortTitle={setSortTitle}
          dontShowNew={dontShowNew}
          dontShowChanges={dontShowChanges}
          isMySubscriptions={isMySubscriptions}
        />
      ),
      disabled: false,
    },
    {
      id: Area.policyArea,
      label: Area.policyArea,
      content: (
        <TabContent
          currentTab={Area.policyArea}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.policyArea]}
          setSortTitle={setSortTitle}
          dontShowNew={dontShowNew}
          dontShowChanges={dontShowChanges}
          isMySubscriptions={isMySubscriptions}
        />
      ),
      disabled: false,
    },
  ]
}

export default TabsList
