import React, { useContext } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { IntlShape, useIntl } from 'react-intl'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { TempCase } from '../../types'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'

import { strings } from './OverviewHeader.strings'
import { FormContext } from '../FormProvider/FormProvider'

interface Props {
  dataTestid?: string
}

export const titleForCase = (
  formatMessage: IntlShape['formatMessage'],
  theCase: Case | TempCase,
) => {
  const isTravelBan =
    theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
    theCase.type === CaseType.TRAVEL_BAN

  if (theCase.state === CaseState.REJECTED) {
    if (isInvestigationCase(theCase.type)) {
      return formatMessage(strings.investigationCaseRejected)
    } else {
      return formatMessage(strings.restrictionCaseRejected)
    }
  }

  if (theCase.state === CaseState.DISMISSED) {
    return formatMessage(strings.dismissedTitle)
  }

  if (theCase.isValidToDateInThePast) {
    return formatMessage(strings.validToDateInThePast, {
      caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
    })
  }

  return isInvestigationCase(theCase.type)
    ? formatMessage(m.investigationAccepted)
    : formatMessage(m.restrictionActive, {
        caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
      })
}
const OverviewHeader: React.FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { dataTestid } = props

  return (
    <Box marginBottom={1} data-testid={dataTestid}>
      <Text as="h1" variant="h1">
        {titleForCase(formatMessage, workingCase)}
      </Text>
    </Box>
  )
}

export default OverviewHeader
