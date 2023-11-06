import { CaseFilter } from '../../../../types/interfaces'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { DebouncedSearch } from '../../../../components'
import { FILTERS_FRONT_PAGE_KEY } from '../../../../utils/consts/consts'
import localization from '../../Home.json'
import { sortLocale } from '../../../../utils/helpers'

interface SearchAndFilterProps {
  PolicyAreas: Array<Option<string>>
  defaultPolicyAreas: Array<number>
  Institutions: Array<Option<string>>
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
  const loc = localization.searchAndFilter

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

  const sortedPolicyAreas = sortLocale({
    list: PolicyAreas,
    sortOption: 'label',
  })

  const sortedInstitutions = sortLocale({
    list: Institutions,
    sortOption: 'label',
  })

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
            />
          </GridColumn>
          <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
            <Select
              isDisabled={loading}
              isSearchable
              size="xs"
              label={loc.policyAreaSelect.label}
              name="policyAreas"
              noOptionsMessage={loc.policyAreaSelect.noOptions}
              options={sortedPolicyAreas}
              placeholder={loc.policyAreaSelect.placeholder}
              onChange={(e) => onChange(e, false)}
              isClearable
              value={
                filters?.policyAreas.length === 1 &&
                [...PolicyAreas].filter(
                  (item) => parseInt(item.value) === filters?.policyAreas[0],
                )?.[0]
              }
            />
          </GridColumn>
          <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
            <Select
              isDisabled={loading}
              isSearchable
              size="xs"
              label={loc.institutionSelect.label}
              name="institutions"
              noOptionsMessage={loc.institutionSelect.noOptions}
              options={sortedInstitutions}
              placeholder={loc.institutionSelect.placeholder}
              onChange={(e) => onChange(e, true)}
              value={
                filters?.institutions.length === 1 &&
                [...Institutions].filter(
                  (item) => parseInt(item.value) === filters?.institutions[0],
                )?.[0]
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
