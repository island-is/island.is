import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '../../../../types'
import Slider from './components/Slider'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './Usage.treat'
import { theme } from '@island.is/island-ui/theme'

const ParentalLeaveUsage: FC<FieldBaseProps> = ({ field }) => {
  const defaultUsage = 4
  const { id } = field
  const { clearErrors } = useFormContext()

  return (
    <Box marginTop={4} marginBottom={6}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.blue400 }}
        />
        <Typography variant="p">
          Sjálfstæður réttur hvors foreldris fyrir sig er 3 mánuðir (90 dagar).
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.mint400 }}
        />
        <Typography variant="p">
          Sameiginlegur réttur foreldra er 3 mánuðir (90 dagar).
        </Typography>
      </Box>
      <Box marginTop={6}>
        <Controller
          defaultValue=""
          name={id}
          render={({ onChange, value }) => (
            <Slider
              totalCells={6}
              sharedCells={3}
              min={1}
              currentIndex={value || defaultUsage}
              onChange={(selectedMonths: number) => {
                clearErrors(id)
                onChange(selectedMonths)
              }}
              label={{ singular: 'mánuður', plural: 'mánuðir' }}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default ParentalLeaveUsage
