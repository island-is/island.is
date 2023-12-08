import React from 'react'
import { Box, Button, DatePicker } from '@island.is/island-ui/core'
import { PeriodFilter } from '../../utils/useFilter'

interface Props {
  onDateChange: (period: PeriodFilter) => void
  periodFrom?: Date
  periodTo?: Date
  minDateCreated?: string
  onFilterFromDates: () => void
}

const FilterDates = ({
  onDateChange,
  periodFrom,
  periodTo,
  minDateCreated,
  onFilterFromDates,
}: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="flexStart"
      alignItems="center"
      marginY={2}
    >
      <DatePicker
        id="periodFrom"
        label="Frá"
        size="sm"
        placeholderText="Frá"
        minDate={minDateCreated ? new Date(minDateCreated) : undefined}
        maxDate={periodTo}
        selected={periodFrom}
        handleChange={(from) => onDateChange({ from })}
        locale="is"
      />
      <DatePicker
        id="periodTo"
        label="Til"
        size="sm"
        placeholderText="Til"
        minDate={periodFrom}
        maxDate={new Date()}
        selected={periodTo}
        handleChange={(to) => onDateChange({ to })}
        locale="is"
      />

      <Button onClick={onFilterFromDates} variant="ghost">
        Sía dags.
      </Button>
    </Box>
  )
}

export default FilterDates
