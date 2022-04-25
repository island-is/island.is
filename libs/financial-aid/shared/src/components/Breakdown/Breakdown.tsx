import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import { Calculations } from '../../lib/interfaces'

interface Props {
  calculations: Calculations[]
}

const Breakdown = ({ calculations }: Props) => {
  return (
    <>
      {calculations.map((item, index) => {
        const isLastItem = index === calculations.length - 1

        return (
          <span key={'calculation-' + index}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              paddingY={2}
              paddingX={3}
              borderTopWidth="standard"
              borderColor="blue200"
              background={isLastItem ? 'blue100' : 'white'}
              borderBottomWidth={isLastItem ? 'standard' : undefined}
            >
              <Text variant="small">{item.title}</Text>
              <Text>{item.calculation}</Text>
            </Box>
          </span>
        )
      })}
    </>
  )
}

export default Breakdown
