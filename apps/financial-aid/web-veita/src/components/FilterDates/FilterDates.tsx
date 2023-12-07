import React from 'react'
import { Box, DatePicker } from '@island.is/island-ui/core'

interface Props {
  minDateCreated: string
}

const FilterDates = ({ minDateCreated }: Props) => {
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
        selected={new Date(minDateCreated)}
        handleChange={(date: Date) => console.log(date)}
        minDate={new Date(minDateCreated)}
      />
      <DatePicker
        label="Til"
        size="sm"
        placeholderText="Pick a date"
        selected={new Date()}
        handleChange={(date: Date) => console.log(date)}
        minDate={new Date(minDateCreated)}
      />
    </Box>
  )
}

export default FilterDates
