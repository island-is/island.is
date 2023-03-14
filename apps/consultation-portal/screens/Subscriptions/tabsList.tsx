import { TabContent } from '../../components/Tab'

export const TabsList = ({
  casesData,
  setCasesData,
  institutionsData,
  setInstitutionsData,
  policyAreasData,
  setPolicyAreasData,
  Area,
  subscriptionArray,
  setSubscriptionArray,
  searchValue,
  setSearchValue,
  sortTitle,
  setSortTitle,
}) => {
  return [
    {
      id: Area.case,
      label: Area.case,
      content: (
        <TabContent
          data={casesData}
          setData={setCasesData}
          currentTab={Area.case}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.case]}
          setSortTitle={setSortTitle}
        />
      ),
      disabled: false,
    },
    {
      id: Area.institution,
      label: Area.institution,
      content: (
        <TabContent
          data={institutionsData}
          setData={setInstitutionsData}
          currentTab={Area.institution}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.institution]}
          setSortTitle={setSortTitle}
        />
      ),
      disabled: false,
    },
    {
      id: Area.policyArea,
      label: Area.policyArea,
      content: (
        <TabContent
          data={policyAreasData}
          setData={setPolicyAreasData}
          currentTab={Area.policyArea}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={setSubscriptionArray}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sortTitle={sortTitle[Area.policyArea]}
          setSortTitle={setSortTitle}
        />
      ),
      disabled: false,
    },
  ]
}

export default TabsList
