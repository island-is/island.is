import React from 'react'
import { Box, DatePicker } from '@island.is/island-ui/core'
import { Filters } from '../../utils/useFilter'

interface Props {
  minDateCreated: string
}

const FilterDates = ({ minDateCreated }: Props) => {
  const endDate = new Date(minDateCreated)
  const startDate = new Date(minDateCreated)

  const minDate = new Date(minDateCreated)
  const maxDate = new Date()

  return (
    <Box
      display="flex"
      width="half"
      justifyContent="flexStart"
      alignItems="center"
      marginY={2}
    >
      <DatePicker
        label="Frá"
        size="sm"
        placeholderText="Pick a date"
        selected={endDate}
        handleChange={(date: Date) => console.log(date)}
        minDate={minDate}
        maxDate={maxDate}
      />
      <DatePicker
        label="Til"
        size="sm"
        placeholderText="Pick a date"
        selected={startDate}
        handleChange={(date: Date) => console.log(date)}
        minDate={minDate}
      />
    </Box>
  )
}

export default FilterDates
