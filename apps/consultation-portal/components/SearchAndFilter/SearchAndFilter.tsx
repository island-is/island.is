import {
  AsyncSearch,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ArrOfValueAndLabel } from '../../types/interfaces'

export interface SearchAndFilterProps {
  searchValue: string
  setSearchValue: (val: string) => void
  PolicyAreas: Array<ArrOfValueAndLabel>
  Institutions: Array<ArrOfValueAndLabel>
  setInstitutionValue: (val: string) => void
  setPolicyAreaValue: (val: string) => void
}

const SearchAndFilter = ({
  searchValue,
  setSearchValue,
  PolicyAreas,
  Institutions,
  setInstitutionValue,
  setPolicyAreaValue,
}: SearchAndFilterProps) => {
  const options = []

  const onChange = (e, isInstitutions: boolean) => {
    if (isInstitutions) {
      setInstitutionValue(e ? e.label : '')
    } else {
      setPolicyAreaValue(e ? e.label : '')
    }
  }

  return (
    <>
      <Hidden below="lg">
        <GridContainer>
          <Box paddingY={4}>
            <GridRow>
              <GridColumn span={['8/12', '8/12', '6/12', '6/12', '6/12']}>
                <Stack space="none">
                  <Text
                    lineHeight="sm"
                    variant="eyebrow"
                    color="blue400"
                    paddingBottom="none"
                  >
                    Leit
                  </Text>
                  <div style={{ marginBottom: '6px' }} />
                  <AsyncSearch
                    label="Leit"
                    size="medium"
                    options={options}
                    placeholder="Að hverju ertu að leita?"
                    initialInputValue=""
                    inputValue={searchValue}
                    onInputValueChange={(value) => {
                      setSearchValue(value)
                    }}
                  />
                </Stack>
              </GridColumn>
              <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
                <Select
                  isSearchable
                  size="xs"
                  label="Málefnasvið"
                  name="policyAreas"
                  noOptionsMessage="Ekkert málefnasvið"
                  options={[...PolicyAreas].sort((a, b) =>
                    a.label.localeCompare(b.label),
                  )}
                  placeholder="Veldu málefnasvið"
                  onChange={(e) => onChange(e, false)}
                  isClearable
                />
              </GridColumn>
              <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
                <Select
                  isSearchable
                  size="xs"
                  label="Stofnun"
                  name="institutions"
                  noOptionsMessage="Enginn stofnun"
                  options={[...Institutions].sort((a, b) =>
                    a.label.localeCompare(b.label),
                  )}
                  placeholder="Veldu stofnun"
                  onChange={(e) => onChange(e, true)}
                  isClearable
                />
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Hidden>
      <Hidden above={'md'}>
        <GridContainer>
          <Box paddingY={4}>
            <AsyncSearch
              colored
              label="Leit"
              size="medium"
              options={options}
              placeholder="Að hverju ertu að leita?"
              initialInputValue=""
              inputValue={searchValue}
              onInputValueChange={(value) => {
                setSearchValue(value)
              }}
            />
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default SearchAndFilter
