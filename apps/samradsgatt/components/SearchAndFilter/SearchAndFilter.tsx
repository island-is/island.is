import {
  AsyncSearch,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'

const SearchAndFilter = ({
  data,
  setData,
  dummycontent,
  searchValue,
  setSearchValue,
  PolicyAreas,
  Institutions,
  options,
}) => {
  const [institutionValue, setInstitutionValue] = useState('')
  const [policyAreaValue, setPolicyAreaValue] = useState('')

  const onChange = (e, isInstitutions: Boolean) => {
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
          const filtered = dummycontent.filter(
            (item) => item.policyArea === policyAreaValue,
          )
          setData(filtered)
          setInstitutionValue('')
        } else {
          setData(dummycontent)
        }
      } else {
        if (institutionValue !== '') {
          const filtered = dummycontent.filter(
            (item) => item.institution === institutionValue,
          )
          setData(filtered)
          setPolicyAreaValue('')
        } else {
          setData(dummycontent)
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
                  <Text variant="eyebrow" color="blue400" paddingBottom="none">
                    Leit
                  </Text>
                  <div style={{ marginBottom: '2px' }} />
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
      <Hidden above={'md'}><p>hidden</p></Hidden>
    </>
  )
}

export default SearchAndFilter
