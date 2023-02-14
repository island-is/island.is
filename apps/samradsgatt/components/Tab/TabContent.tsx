import {
  AsyncSearch,
  Box,
  Button,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
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
  label = 'Leit',
}) => {
  const onLoadMore = () => {
    console.log('clicked on load more')
  }

  const paddingTop = [3, 3, 3, 9] as ResponsiveSpace

  return (
    <Box paddingTop={paddingTop}>
      <AsyncSearch
        label={label}
        colored={true}
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
      <Box paddingY={3}>
        <Button icon="eye" variant="text" onClick={onLoadMore}>
          Sýna fleiri mál
        </Button>
      </Box>
    </Box>
  )
}

export default TabContent
