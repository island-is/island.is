import React, { FC, useState } from 'react'
import { FieldBaseProps } from '../../../../types'
import Slider from './components/Slider'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './Usage.treat'
import { theme } from '@island.is/island-ui/theme'

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
    <Box marginTop={4}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.blue400 }}
        ></Box>
        <Typography variant="p">
          Sjálfstæður réttur hvors foreldris fyrir sig er 3 mánuðir (90 dagar).
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.mint400 }}
        ></Box>
        <Typography variant="p">
          Sameiginlegur réttur foreldra er 3 mánuðir (90 dagar).
        </Typography>
      </Box>
      <Box marginTop={6}>
        <Slider
          totalCells={6}
          sharedCells={3}
          currentIndex={months}
          onChange={updateMonths}
          label={{ singular: 'mánuður', plural: 'mánuðir' }}
        />
      </Box>
    </Box>
  )
}

export default ParentalLeaveUsage
