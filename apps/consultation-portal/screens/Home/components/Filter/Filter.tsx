import { CaseFilter } from '../../../../types/interfaces'
import { Box, Button, DatePicker, Stack } from '@island.is/island-ui/core'
import { FilterBox } from './components/Filterbox'
import { FILTERS_FRONT_PAGE_KEY } from '../../../../utils/consts/consts'
import { getItem } from '../../../../utils/helpers/localStorage'
import localization from '../../Home.json'
import { FilterTypes } from '../../../../types/enums'

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
  const loc = localization.filter.filter
  const onChange = (date: Date, type: string) => {
    const filtersCopy = { ...filters }
    filtersCopy.period[type] = date
    filtersCopy.pageNumber = 0
    setFilters(filtersCopy)
  }

  const handleClear = () => {
    getItem({ key: FILTERS_FRONT_PAGE_KEY, clear: true })
    setFilters(initialValues)
  }

  return (
    <Stack space={3}>
      <FilterBox
        title={loc.sortBoxTitle}
        filters={filters}
        setFilters={setFilters}
        type={FilterTypes.sorting}
        loading={loading}
      />
      <FilterBox
        title={loc.statusBoxTitle}
        filters={filters}
        setFilters={setFilters}
        type={FilterTypes.caseStatuses}
        loading={loading}
      />
      <FilterBox
        title={loc.typeBoxTitle}
        filters={filters}
        setFilters={setFilters}
        type={FilterTypes.caseTypes}
        loading={loading}
      />

      <DatePicker
        disabled={loading}
        size="sm"
        locale="is"
        label={loc.datePickerFromLabel}
        placeholderText={loc.datePickerPlaceholder}
        selected={new Date(filters.period.from)}
        handleChange={(e) => onChange(e, 'from')}
      />
      <DatePicker
        disabled={loading}
        size="sm"
        locale="is"
        label={loc.datePickerToLabel}
        placeholderText={loc.datePickerPlaceholder}
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
          {loc.clearButtonLabel}
        </Button>
      </Box>
    </Stack>
  )
}

export default Filter
