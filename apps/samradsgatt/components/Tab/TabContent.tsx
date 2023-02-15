import {
  AsyncSearch,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import DropdownSort from '../DropdownSort/DropdownSort'
import SubscriptionTable from '../Table/SubscriptionTable'

const TabContent = ({
  data,
  setData,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  searchOptions,
  searchValue,
  setSearchValue,
  searchPlaceholder,
  label = 'Leit',
  sortTitle,
  setSortTitle,
}) => {
  const onLoadMore = () => {
    console.log('clicked on load more')
  }

  const paddingTop = [3, 3, 3, 9] as ResponsiveSpace

  const onSortClick = (val: string) => {
    const dataCopy = [...data]
    if (val === 'Stafrófsröð') {
      dataCopy.sort((a, b) => a.name.localeCompare(b.name))
    } else if (val === 'Nýjast efst') {
      dataCopy.sort((a, b) => (a.id < b.id ? -1 : 1))
    } else if (val === 'Elst efst') {
      dataCopy.sort((a, b) => (a.id > b.id ? -1 : 1))
    }
    sortTitle[currentTab] = val
    setSortTitle(sortTitle)
    setData(dataCopy)
  }

  const sortOpts = [
    {
      title: 'Stafrófsröð',
      onClick: () => onSortClick('Stafrófsröð'),
    },
    {
      title: 'Nýjast efst',
      onClick: () => onSortClick('Nýjast efst'),
    },
    {
      title: 'Elst efst',
      onClick: () => onSortClick('Elst efst'),
    },
  ]

  return (
    <Box paddingTop={paddingTop}>
      <Hidden above={'sm'}>
        <Box paddingBottom={1}>
          <Text variant="eyebrow">Leit og röðun</Text>
        </Box>
      </Hidden>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '9/12', '10/12']}>
            <Stack space={1}>
              <Hidden below={'md'}>
                <Text variant="eyebrow">Leit</Text>
              </Hidden>
              <AsyncSearch
                label={label}
                colored={true}
                options={searchOptions}
                placeholder={searchPlaceholder}
                initialInputValue={searchValue}
                inputValue={searchValue}
                onInputValueChange={(val) => setSearchValue(val)}
              />
              <Hidden above={'sm'}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle[currentTab]}
                />
              </Hidden>
            </Stack>
          </GridColumn>

          <GridColumn span={['1/12', '1/12', '4/12', '3/12', '2/12']}>
            <Hidden below={'md'}>
              <Stack space={1}>
                <Text variant="eyebrow">Röðun</Text>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle[currentTab]}
                />
              </Stack>
            </Hidden>
          </GridColumn>
        </GridRow>
      </GridContainer>

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
