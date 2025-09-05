import { Dispatch, SetStateAction } from 'react'

import { Box, DatePicker, Select } from '@island.is/island-ui/core'
import { DateFilter } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import { FilterLayout } from './StatisticFilterLayout'

export type FilterType = 'period' | 'created' | 'sentToCourt' | 'institution'

const DatePickers = ({
  name,
  labelFrom,
  labelTo,
  selectedDateFilter,
  setFromDate,
  setToDate,
  minDate,
}: {
  name: string
  labelFrom: string
  labelTo: string
  selectedDateFilter: DateFilter
  setFromDate: (date?: Date) => void
  setToDate: (date?: Date) => void
  minDate?: Date
}) => {
  return (
    <Box display="flex" flexDirection="row" columnGap={2}>
      <DatePicker
        name={`${name}StatisticsDateFrom`}
        label={labelFrom}
        placeholderText="Frá"
        size="xs"
        selected={selectedDateFilter.fromDate ?? minDate}
        minDate={minDate}
        maxDate={new Date()}
        handleChange={(date: Date | null) => setFromDate(date ?? undefined)}
      />
      <DatePicker
        name={`${name}StatisticsDateTo`}
        label={labelTo}
        placeholderText="Til"
        size="xs"
        maxDate={new Date()}
        minDate={selectedDateFilter.fromDate ?? minDate}
        selected={selectedDateFilter.toDate}
        handleChange={(date: Date | null) => setToDate(date ?? undefined)}
      />
    </Box>
  )
}

const FilterComponent = <T extends object>({
  type,
  filters,
  setFilters,
  minDate,
}: {
  type: FilterType
  filters: T
  setFilters: Dispatch<SetStateAction<T>>
  minDate?: Date
}) => {
  const { districtCourts } = useInstitution()

  // below we can add filter selectors for all stats pages
  if (type === 'created') {
    const currentValue = (type in filters ? filters.created : {}) as DateFilter
    return (
      <DatePickers
        name="created"
        labelFrom="Stofndagsetning frá"
        labelTo="Stofndagsetning til"
        selectedDateFilter={currentValue}
        minDate={minDate}
        setFromDate={(fromDate) =>
          setFilters((prev) => ({
            ...prev,
            created: { ...currentValue, fromDate },
          }))
        }
        setToDate={(toDate) =>
          setFilters((prev) => ({
            ...prev,
            created: { ...currentValue, toDate },
          }))
        }
      />
    )
  }

  if (type === 'sentToCourt') {
    const currentValue = (
      type in filters ? filters.sentToCourt : {}
    ) as DateFilter
    return (
      <DatePickers
        name="sentToCourt"
        labelFrom="Mál sent til dómstóls frá"
        labelTo="Mál sent til dómstóls til"
        selectedDateFilter={currentValue}
        minDate={minDate}
        setFromDate={(fromDate) =>
          setFilters((prev) => ({
            ...prev,
            sentToCourt: { ...currentValue, fromDate },
          }))
        }
        setToDate={(toDate) =>
          setFilters((prev) => ({
            ...prev,
            sentToCourt: { ...currentValue, toDate },
          }))
        }
      />
    )
  }
  if (type === 'institution') {
    const currentValue = (type in filters ? filters.institution : null) as {
      label: string
      value: string
    }
    return (
      <Select
        name="court"
        label="Dómstóll"
        placeholder="Dómstóll"
        size="xs"
        options={districtCourts.map((court) => ({
          label: court.name ?? '',
          value: court.id ?? '',
        }))}
        onChange={(selectedOption) =>
          setFilters((prev) => ({
            ...prev,
            institution: selectedOption ?? undefined,
          }))
        }
        value={currentValue}
      />
    )
  }

  if (type === 'period') {
    const currentValue = (type in filters ? filters.period : {}) as DateFilter
    return (
      <DatePickers
        name="period"
        labelFrom="Dagsetning frá"
        labelTo="Dagsetning til"
        selectedDateFilter={currentValue}
        minDate={minDate}
        setFromDate={(fromDate) =>
          setFilters((prev) => ({
            ...prev,
            period: { ...currentValue, fromDate },
          }))
        }
        setToDate={(toDate) =>
          setFilters((prev) => ({
            ...prev,
            period: { ...currentValue, toDate },
          }))
        }
      />
    )
  }
}

export const Filters = <T extends object>({
  id,
  types,
  filters,
  setFilters,
  onClear,
  minDate,
}: {
  id: string
  types: FilterType[]
  filters: T
  setFilters: Dispatch<SetStateAction<T>>
  onClear: () => void
  minDate?: Date
}) => {
  return (
    <FilterLayout id={id} onClear={onClear}>
      {types.map((type, key) => (
        <FilterComponent
          key={`${id}-${type}-${key}`}
          type={type}
          filters={filters}
          setFilters={setFilters}
          minDate={minDate}
        />
      ))}
    </FilterLayout>
  )
}
