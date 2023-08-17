import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { displayFirstPlusRemaining } from '@island.is/judicial-system/formatters'

import * as styles from './CourtCaseNumber.css'

interface Props {
  courtCaseNumber?: string
  policeCaseNumbers: string[]
  appealCaseNumber?: string
}

const CourtCaseNumber: React.FC<React.PropsWithChildren<Props>> = ({
  courtCaseNumber,
  policeCaseNumbers,
  appealCaseNumber,
}) => {
  if (appealCaseNumber) {
    return (
      <Box display="flex" flexDirection="column">
        <Text as="span" variant="small">
          {appealCaseNumber}
        </Text>
        <Text as="span" variant="small">
          {courtCaseNumber}
        </Text>
        <Text as="span" variant="small">
          {displayFirstPlusRemaining(policeCaseNumbers)}
        </Text>
      </Box>
    )
  }

  return courtCaseNumber ? (
    <>
      <Box component="span" className={styles.blockColumn}>
        <Text as="span">{courtCaseNumber}</Text>
      </Box>
      <Text
        as="span"
        variant="small"
        color="dark400"
        title={policeCaseNumbers.join(', ')}
      >
        {displayFirstPlusRemaining(policeCaseNumbers)}
      </Text>
    </>
  ) : (
    <Text as="span" title={policeCaseNumbers.join(', ')}>
      {displayFirstPlusRemaining(policeCaseNumbers) || '-'}
    </Text>
  )
}

export default CourtCaseNumber
