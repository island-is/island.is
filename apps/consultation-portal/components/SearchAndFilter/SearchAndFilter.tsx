import { ArrOfValueAndLabel, CaseFilter } from '../../types/interfaces'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
} from '@island.is/island-ui/core'
import DebouncedSearch from '../DebouncedSearch/DebouncedSearch'
import { FILTERS_FRONT_PAGE_KEY } from '../../utils/consts/consts'

interface SearchAndFilterProps {
  PolicyAreas: Array<ArrOfValueAndLabel>
  defaultPolicyAreas: Array<number>
  Institutions: Array<ArrOfValueAndLabel>
  defaultInstitutions: Array<number>
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  loading?: boolean
}

const SearchAndFilter = ({
  PolicyAreas,
  defaultPolicyAreas,
  Institutions,
  defaultInstitutions,
  filters,
  setFilters,
  loading,
}: SearchAndFilterProps) => {
  const onChange = (e, isInstitutions: boolean) => {
    const filtersCopy = { ...filters }
    if (isInstitutions) {
      filtersCopy.institutions = e ? [parseInt(e.value)] : defaultInstitutions
    } else {
      filtersCopy.policyAreas = e ? [parseInt(e.value)] : defaultPolicyAreas
    }
    filtersCopy.pageNumber = 0
    setFilters(filtersCopy)
  }

  return (
    <GridContainer>
      <Box paddingY={4}>
        <GridRow>
          <GridColumn span={['8/12', '8/12', '6/12', '6/12', '6/12']}>
            <DebouncedSearch
              filters={filters}
              setFilters={setFilters}
              name="front_page_search"
              localStorageId={FILTERS_FRONT_PAGE_KEY}
              isDisabled={loading}
            />
          </GridColumn>
          <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
            <Select
              disabled={loading}
              isSearchable
              size="xs"
              label="Málefnasvið"
              name="policyAreas"
              aria-selected="false"
              noOptionsMessage="Ekkert málefnasvið"
              options={[...PolicyAreas].sort((a, b) =>
                a.label.localeCompare(b.label),
              )}
              placeholder="Veldu málefnasvið"
              onChange={(e) => onChange(e, false)}
              isClearable
              value={
                filters?.policyAreas.length === 1 &&
                [...PolicyAreas].filter(
                  (item) => parseInt(item.value) === filters?.policyAreas[0],
                )
              }
            />
          </GridColumn>
          <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
            <Select
              disabled={loading}
              isSearchable
              size="xs"
              label="Stofnun"
              name="institutions"
              aria-selected="false"
              noOptionsMessage="Enginn stofnun"
              options={[...Institutions].sort((a, b) =>
                a.label.localeCompare(b.label),
              )}
              placeholder="Veldu stofnun"
              onChange={(e) => onChange(e, true)}
              value={
                filters?.institutions.length === 1 &&
                [...Institutions].filter(
                  (item) => parseInt(item.value) === filters?.institutions[0],
                )
              }
              isClearable
            />
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}

export default SearchAndFilter
