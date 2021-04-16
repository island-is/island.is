import React from 'react'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseGender,
} from '@island.is/judicial-system/types'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'

interface Props {
  rulingDate: string
  accusedGender: CaseGender
  accusedCanAppeal: boolean
  prosecutorCanAppeal: boolean
  handleAccusedAppeal: () => void
  handleProsecutorAppeal: () => void
}

const AppealSection: React.FC<Props> = (props) => {
  const {
    rulingDate,
    accusedGender,
    accusedCanAppeal,
    prosecutorCanAppeal,
    handleAccusedAppeal,
    handleProsecutorAppeal,
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
      {accusedCanAppeal ? (
        <Button size="small" onClick={handleAccusedAppeal}>
          {`${capitalize(
            formatAccusedByGender(accusedGender),
          )} kærir úrskurðinn`}
        </Button>
      ) : (
        <AlertMessage
          type="info"
          title="bla"
          message={`${capitalize(
            formatAccusedByGender(accusedGender),
          )} hefur kært úrskurðinn ${formatDate(new Date(), 'PPPp')}`}
        />
      )}
      {prosecutorCanAppeal ? (
        <Box marginTop={3}>
          <Button size="small" onClick={handleProsecutorAppeal}>
            Sækjandi kærir úrskurðinn
          </Button>
        </Box>
      ) : (
        <AlertMessage
          type="info"
          title="bla"
          message={`Sækjandi hefur kært úrskurðinn ${formatDate(
            new Date(),
            'PPPp',
          )}`}
        />
      )}
    </>
  )
}

export default AppealSection
