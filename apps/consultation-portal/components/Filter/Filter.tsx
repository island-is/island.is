import { CaseFilter } from '../../types/interfaces'
import { Box, Button, DatePicker, Stack } from '@island.is/island-ui/core'
import FilterBox from '../Filterbox/Filterbox'

interface FilterProps {
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  defaultValues: CaseFilter
  loading?: boolean
}

export const Filter = ({
  filters,
  setFilters,
  defaultValues,
  loading,
}: FilterProps) => {
  const onChange = (e, type: string) => {
    const filtersCopy = { ...filters }
    filtersCopy.period[type] = e
    setFilters(filtersCopy)
  }

  const handleClear = () => {
    setFilters(defaultValues)
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
