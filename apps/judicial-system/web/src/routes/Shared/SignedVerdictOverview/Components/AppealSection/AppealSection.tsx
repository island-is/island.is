import React from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  formatAccusedByGender,
} from '@island.is/judicial-system/formatters'
import { CaseGender } from '@island.is/judicial-system/types'

interface Props {
  rulingDate: string
  accusedGender: CaseGender
  accusedCanAppeal: boolean
  prosecutorCanAppeal: boolean
}

const AppealSection: React.FC<Props> = (props) => {
  const {
    rulingDate,
    accusedGender,
    accusedCanAppeal,
    prosecutorCanAppeal,
  } = props

  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h3" as="h3">
          Ákvörðun um kæru
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{`Kærufrestur rennur út ${getAppealEndDate(rulingDate)}`}</Text>
      </Box>
      {accusedCanAppeal && (
        <Button size="small">
          {`${capitalize(
            formatAccusedByGender(accusedGender),
          )} kærir úrskurðinn`}
        </Button>
      )}
      {prosecutorCanAppeal && (
        <Box marginTop={3}>
          <Button size="small">Sækjandi kærir úrskurðinn</Button>
        </Box>
      )}
    </>
  )
}

export default AppealSection
