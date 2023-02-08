import { AsyncSearch, Box, Button } from '@island.is/island-ui/core'
import SubscriptionTable from '../Table/SubscriptionTable'

const TabContent = ({
  data,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  searchOptions,
  searchValue,
  setSearchValue,
  searchPlaceholder,
}) => {
    const onLoadMore = () => {
        console.log('clicked on load more')
      }

  return (
    <Box paddingTop={3} paddingY={3}>
      <AsyncSearch
        options={searchOptions}
        placeholder={searchPlaceholder}
        initialInputValue={searchValue}
        inputValue={searchValue}
        onInputValueChange={(val) => setSearchValue(val)}
      />
      <SubscriptionTable
        data={data}
        currentTab={currentTab}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
      />
      <Button icon="eye" variant="text" onClick={onLoadMore}>Sýna fleiri mál</Button>
    </Box>
  )
}

export default TabContent
