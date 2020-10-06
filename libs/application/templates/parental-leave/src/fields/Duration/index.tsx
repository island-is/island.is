import React, { FC, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import Slider from '../components/Slider'

import { theme } from '@island.is/island-ui/theme'

const ParentalLeaveUsage: FC<FieldBaseProps> = ({ field, formValue }) => {
  const { id } = field
  const { clearErrors } = useFormContext()

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const monthsToUse = (formValue.usage as number) || 1
  const [monthsToSpread, setMonthsToSpread] = useState<number>(monthsToUse)
  const minMonths = 1
  const maxMonths = 24

  useEffect(() => {
    // TODO: Calculate the percentage they can receive based on the duration spread
  }, [monthsToSpread, monthsToUse])

  return (
    <Box marginTop={8}>
      <Controller
        defaultValue={monthsToUse}
        name={id}
        render={({ onChange, value }) => (
          <Slider
            min={minMonths}
            max={maxMonths}
            trackStyle={{ gridTemplateRows: 8 }}
            calculateCellStyle={(index: number) => {
              const isActive =
                (value && index < value) ||
                (monthsToSpread && index < monthsToSpread) ||
                index < monthsToUse
              return {
                background: isActive
                  ? theme.color.mint400
                  : theme.color.dark200,
              }
            }}
            showMinMaxLabels
            showToolTip
            label={{ singular: 'mánuður', plural: 'mánuðir' }}
            currentIndex={value || monthsToSpread || monthsToUse}
            onChange={(selectedMonthsToSpread: number) => {
              clearErrors(id)
              onChange(selectedMonthsToSpread)
              setMonthsToSpread(selectedMonthsToSpread)
            }}
          />
        )}
      />
    </Box>
  )
}

export default ParentalLeaveUsage
