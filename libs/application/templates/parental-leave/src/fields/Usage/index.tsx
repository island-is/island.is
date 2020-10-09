import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '@island.is/application/core'
import Slider from '../components/Slider'
import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './Usage.treat'
import { theme } from '@island.is/island-ui/theme'

const ParentalLeaveUsage: FC<FieldBaseProps> = ({ field }) => {
  const defaultUsage = 4
  const { id } = field
  const { clearErrors } = useFormContext()

  const sharedMonths = 3
  const maxMonths = 6

  return (
    <Box marginTop={4} marginBottom={6}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.blue400 }}
        />
        <Text>
          Sjálfstæður réttur hvors foreldris fyrir sig er 3 mánuðir (90 dagar).
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          className={styles.key}
          style={{ background: theme.color.mint400 }}
        />
        <Text>Sameiginlegur réttur foreldra er 3 mánuðir (90 dagar).</Text>
      </Box>
      <Box marginTop={6}>
        <Controller
          defaultValue=""
          name={id}
          render={({ onChange, value }) => (
            <Slider
              min={1}
              max={maxMonths}
              trackStyle={{ gridGap: 2, gridTemplateRows: 40 }}
              calculateCellStyle={(index: number) => {
                const isShared = index >= maxMonths - sharedMonths
                return {
                  background: isShared
                    ? theme.color.mint400
                    : theme.color.blue400,
                }
              }}
              showLabel
              label={{ singular: 'mánuður', plural: 'mánuðir' }}
              currentIndex={value || defaultUsage}
              onChange={(selectedMonths: number) => {
                clearErrors(id)
                onChange(selectedMonths)
              }}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default ParentalLeaveUsage
