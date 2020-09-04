import React, { FC, useState } from 'react'
import { FieldBaseProps } from '../../../../types'
import Slider from './components/Slider'

const ParentalLeaveUsage: FC<FieldBaseProps> = ({
  error,
  field,
  formValue,
}) => {
  // const [months, setMonths] = useState(monthsToUse || 4)
  const [months, setMonths] = useState(4)

  const updateMonths = (months: number) => {
    setMonths(months)
  }

  return (
    <div>
      <Slider
        totalCells={6}
        sharedCells={2}
        currentIndex={months}
        onChange={updateMonths}
      />
    </div>
  )
}

export default ParentalLeaveUsage
