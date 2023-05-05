import { CaseFilter } from '../../types/interfaces'
import { Box, Button, DatePicker, Stack } from '@island.is/island-ui/core'
import FilterBox from '../Filterbox/Filterbox'
import { FILTERS_FRONT_PAGE_KEY } from '@island.is/consultation-portal/utils/consts/consts'
import { getItem } from '@island.is/consultation-portal/utils/helpers/localStorage'

interface FilterProps {
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  initialValues: CaseFilter
  loading?: boolean
}

export const Filter = ({
  filters,
  setFilters,
  initialValues,
  loading,
}: FilterProps) => {
  const onChange = (e, type: string) => {
    const filtersCopy = { ...filters }
    filtersCopy.period[type] = e
    filtersCopy.pageNumber = 0
    setFilters(filtersCopy)
  }

  const handleClear = () => {
    getItem({ key: FILTERS_FRONT_PAGE_KEY, clear: true})
    setFilters(initialValues)
  }

  return (
    <Stack space={2}>
      <FilterBox
        title="Röðun"
        filters={filters}
        setFilters={setFilters}
        type="sorting"
        loading={loading}
      />
      <FilterBox
        title="Staða máls"
        filters={filters}
        setFilters={setFilters}
        type="caseStatuses"
        loading={loading}
      />
      <FilterBox
        title="Tegund máls"
        filters={filters}
        setFilters={setFilters}
        type="caseTypes"
        loading={loading}
      />

      <DatePicker
        disabled={loading}
        size="sm"
        locale="is"
        label="Frá"
        placeholderText="Veldu dagsetningu"
        selected={new Date(filters.period.from)}
        handleChange={(e) => onChange(e, 'from')}
      />
      <DatePicker
        disabled={loading}
        size="sm"
        locale="is"
        label="Til"
        placeholderText="Veldu dagsetningu"
        selected={new Date(filters.period.to)}
        handleChange={(e) => onChange(e, 'to')}
      />

      <Box textAlign={'right'}>
        <Button
          size="small"
          icon="reload"
          variant="text"
          onClick={handleClear}
          loading={loading}
        >
          Hreinsa allar síur
        </Button>
      </Box>
    </Stack>
  )
}

export default Filter
