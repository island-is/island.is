import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LabelValue } from '@island.is/judicial-system-web/src/components'

interface Props {
  title: string
  count: number
  averageDays?: number | null
}

export const ServiceStatusItem: React.FC<Props> = ({
  title,
  count,
  averageDays,
}) => {
  return (
    <Box
      background="blue100"
      borderRadius="large"
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
    >
      <LabelValue label={title} value={count} />

      {!!averageDays && (
        <>
          <Box flexGrow={1} marginX={2}>
            <div
              style={{
                height: '1px',
                borderBottom: `1px dotted ${theme.color.blue200}`,
                width: '100%',
              }}
            />
          </Box>
          <Text>
            <b>{averageDays} dagar</b>
          </Text>
        </>
      )}
    </Box>
  )
}

export default ServiceStatusItem
