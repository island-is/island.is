import { sorting } from '../../utils/helpers'
import {
  AsyncSearch,
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useEffect } from 'react'
import { Area, SortOptions } from '../../types/enums'
import DropdownSort from '../DropdownSort/DropdownSort'

const SearchAndSort = ({
  data,
  setData,
  searchValue,
  setSearchValue,
  label = 'Leit',
  searchPlaceholder = 'Leitaðu að máli, stofnun eða málefnasviði',
  sortTitle,
  setSortTitle,
  currentTab,
}) => {
  const searchOptions = []

  useEffect(() => {
    const sortedData = sorting(data, sortTitle)
    setData(sortedData)
  }, [sortTitle])

  const sortOpts = [
    {
      title: SortOptions.latest,
    },
    {
      title: SortOptions.aToZ,
    },
    {
      title: SortOptions.oldest,
    },
  ]

  if (currentTab !== Area.case) {
    return (
      <GridRow>
        <GridColumn span={'12/12'}>
          <Stack space={1}>
            <Hidden below="md">
              <Text variant="eyebrow">Leit</Text>
            </Hidden>
            <AsyncSearch
              label={label}
              colored={true}
              options={searchOptions}
              placeholder={searchPlaceholder}
              initialInputValue={searchValue}
              inputValue={searchValue}
              onInputValueChange={(value) => setSearchValue(value)}
            />
          </Stack>
        </GridColumn>
      </GridRow>
    )
  }

  return (
    <>
      <Hidden above={'sm'}>
        <Box paddingBottom={1}>
          <Text variant="eyebrow">Leit og röðun</Text>
        </Box>
      </Hidden>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '8/12', '9/12', '10/12']}>
          <Stack space={1}>
            <Hidden below="md">
              <Text variant="eyebrow">Leit</Text>
            </Hidden>
            <AsyncSearch
              label={label}
              colored={true}
              options={searchOptions}
              placeholder={searchPlaceholder}
              initialInputValue={searchValue}
              inputValue={searchValue}
              onInputValueChange={(value) => setSearchValue(value)}
            />
            <Hidden above="sm">
              <Box paddingTop={1}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle}
                  setTitle={(newTitle: SortOptions) => setSortTitle(newTitle)}
                />
              </Box>
            </Hidden>
          </Stack>
        </GridColumn>
        <GridColumn span={['0', '0', '4/12', '3/12', '2/12']}>
          <Hidden below="md">
            <Stack space={1}>
              <Text variant="eyebrow">Röðun</Text>
              <div style={{ zIndex: 1, position: 'relative' }}>
                <DropdownSort
                  menuAriaLabel="sort by"
                  items={sortOpts}
                  icon="menu"
                  title={sortTitle}
                  setTitle={(newTitle: SortOptions) => setSortTitle(newTitle)}
                />
              </div>
            </Stack>
          </Hidden>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default SearchAndSort
