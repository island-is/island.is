import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Button,
  GridColumn,
  GridRow,
  Hidden,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Area } from '../../types/enums'
import {
  ArrOfIdAndName,
  Case,
  SortTitle,
  SubscriptionArray,
} from '../../types/interfaces'
import DropdownSort from '../DropdownSort/DropdownSort'
import SubscriptionTable from '../Table/SubscriptionTable'

export interface TabContentProps {
  data: Array<Case> | Array<ArrOfIdAndName>
  setData: (arr: Array<any>) => void
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (obj: SubscriptionArray) => void
  searchOptions: AsyncSearchOption[]
  searchValue: string
  setSearchValue: (str: string) => void
  searchPlaceholder: string
  label?: string
  sortTitle: SortTitle
  setSortTitle: (obj: SortTitle) => void
}

export const TabContent = ({
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
}: TabContentProps) => {
  const onLoadMore = () => {
    console.log('clicked on load more')
  }

  const paddingTop = [3, 3, 3, 5, 5] as ResponsiveSpace

  const onSortClick = (val: string) => {
    const dataCopy = [...data]
    if (val === 'Stafrófsröð') {
      dataCopy.sort((a, b) => a.name.localeCompare(b.name))
    } else if (val === 'Nýjast efst') {
      dataCopy.sort((a, b) => (a.id > b.id ? -1 : 1))
    } else if (val === 'Elst efst') {
      dataCopy.sort((a, b) => (a.id < b.id ? -1 : 1))
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
              <Box paddingTop={1}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle[currentTab]}
                />
              </Box>
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
