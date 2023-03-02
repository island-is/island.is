import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { ArrOfValueAndLabel, Case } from '../../types/interfaces'

export interface SearchAndFilterProps {
  data: Array<Case>
  setData: (arr: Array<Case>) => void
  cases: Array<Case>
  searchValue: string
  setSearchValue: (val: string) => void
  PolicyAreas: Array<ArrOfValueAndLabel>
  Institutions: Array<ArrOfValueAndLabel>
  options?: Array<AsyncSearchOption>
}

const SearchAndFilter = ({
  data,
  setData,
  cases,
  searchValue,
  setSearchValue,
  PolicyAreas,
  Institutions,
  options,
}: SearchAndFilterProps) => {
  const [institutionValue, setInstitutionValue] = useState('')
  const [policyAreaValue, setPolicyAreaValue] = useState('')

  const onChange = (e, isInstitutions: boolean) => {
    // e is not null so we know it has a selection
    if (e) {
      let label = 'policyArea'
      if (isInstitutions) {
        label = 'institution'
        setInstitutionValue(e.label)
      } else {
        setPolicyAreaValue(e.label)
      }
      const filtered = data.filter((item) => item[label] === e.label)
      setData(filtered)
    } else {
      // check which one should be cleared
      if (isInstitutions) {
        if (policyAreaValue !== '') {
          const filtered = cases.filter(
            (item) => item.policyAreaName === policyAreaValue,
          )
          setData(filtered)
          setInstitutionValue('')
        } else {
          setData(cases)
        }
      } else {
        if (institutionValue !== '') {
          const filtered = cases.filter(
            (item) => item.institutionName === institutionValue,
          )
          setData(filtered)
          setPolicyAreaValue('')
        } else {
          setData(cases)
        }
      }
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
