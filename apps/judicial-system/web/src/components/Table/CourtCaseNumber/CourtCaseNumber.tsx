import { FC } from 'react'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { displayFirstPlusRemaining } from '@island.is/judicial-system/formatters'

import * as styles from './CourtCaseNumber.css'

interface Props {
  courtCaseNumber?: string | null
  policeCaseNumbers?: string[] | null
  appealCaseNumber?: string | null
  publicProsecutorIsRegisteredInPoliceSystem?: boolean | null
}

const CourtCaseNumber: FC<Props> = ({
  courtCaseNumber,
  policeCaseNumbers,
  appealCaseNumber,
  publicProsecutorIsRegisteredInPoliceSystem,
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
        <Text>{courtCaseNumber}</Text>
      </Box>
      <Box component="span" className={styles.policeCaseNumbers}>
        {publicProsecutorIsRegisteredInPoliceSystem && (
          <Icon icon="checkmark" color="blue400" size="medium" />
        )}
        <Text variant="small">
          {displayFirstPlusRemaining(policeCaseNumbers)}
        </Text>
      </Box>
    </>
  ) : (
    <Text>{displayFirstPlusRemaining(policeCaseNumbers) || '-'}</Text>
  )
}

export default CourtCaseNumber
