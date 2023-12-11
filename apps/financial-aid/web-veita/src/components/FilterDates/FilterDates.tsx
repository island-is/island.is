import React from 'react'
import { Box, DatePicker } from '@island.is/island-ui/core'
import { PeriodFilter } from '@island.is/financial-aid-web/veita/src/utils/useFilter'

interface Props {
  onDateChange: (period: PeriodFilter) => void
  periodFrom?: Date
  periodTo?: Date
  minDateCreated?: string
}

const FilterDates = ({
  onDateChange,
  periodFrom,
  periodTo,
  minDateCreated,
}: Props) => {
  const minDate = minDateCreated ? new Date(minDateCreated) : undefined
  return (
    <Box
      display="flex"
      justifyContent="flexStart"
      alignItems="center"
      columnGap={2}
    >
      {minDateCreated && (
        <DatePicker
          id="periodFrom"
          label="Frá"
          size="xs"
          placeholderText="Frá"
          minDate={minDate}
          maxDate={periodTo}
          selected={periodFrom ? periodFrom : new Date(minDateCreated)}
          handleChange={(from) => onDateChange({ from })}
          locale="is"
        />
      )}

      <DatePicker
        id="periodTo"
        label="Til"
        size="xs"
        placeholderText="Til"
        minDate={periodFrom}
        maxDate={new Date()}
        selected={periodTo}
        handleChange={(to) => onDateChange({ to })}
        locale="is"
      />
    </Box>
  )
}

export default FilterDates
