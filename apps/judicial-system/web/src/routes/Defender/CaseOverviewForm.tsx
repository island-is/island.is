import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { defenderCaseOverview } from '@island.is/judicial-system-web/messages'
import RestrictionTags from '@island.is/judicial-system-web/src/components/RestrictionTags/RestrictionTags'
import CaseDates from '@island.is/judicial-system-web/src/components/CaseDates/CaseDates'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'

interface Props {
  workingCase: Case
}

const CaseOverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  const { formatMessage } = useIntl()

  const titleForCase = (theCase: Case) => {
    if (theCase.state === CaseState.REJECTED) {
      return isInvestigationCase(theCase.type)
        ? formatMessage(defenderCaseOverview.title.investigationCaseRejected)
        : formatMessage(defenderCaseOverview.title.restrictionCaseRejected)
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(defenderCaseOverview.title.caseDismissed)
    }

    if (theCase.state === CaseState.ACCEPTED) {
      if (isInvestigationCase(theCase.type)) {
        return formatMessage(
          defenderCaseOverview.title.investigationCaseAccepted,
        )
      }

      const caseType =
        theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          ? CaseType.TRAVEL_BAN
          : theCase.type

      if (theCase.isValidToDateInThePast) {
        return formatMessage(
          defenderCaseOverview.title.restrictionCaseExpired,
          { caseType },
        )
      }

      return formatMessage(defenderCaseOverview.title.restrictionCaseActive, {
        caseType,
      })
    }

    return isInvestigationCase(theCase.type)
      ? ''
      : formatMessage(defenderCaseOverview.title.restrictionCaseScheduled, {
          caseType: theCase.type,
          isExtended: Boolean(theCase.parentCase),
        })
  }

  return (
    <FormContentContainer>
      <Box marginBottom={5}>
        <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
          <Box>
            <Box marginBottom={1}>
              <Text as="h1" variant="h1">
                {titleForCase(workingCase)}
              </Text>
            </Box>
            {completedCaseStates.includes(workingCase.state) && (
              <Box>
                <Text variant="h5">
                  {formatMessage(defenderCaseOverview.rulingDate, {
                    courtEndTime: `${formatDate(
                      workingCase.courtEndTime,
                      'PPP',
                    )} kl. ${formatDate(
                      workingCase.courtEndTime,
                      TIME_FORMAT,
                    )}`,
                  })}
                </Text>
              </Box>
            )}
          </Box>
          {completedCaseStates.includes(workingCase.state) && (
            <Box display="flex" flexDirection="column">
              <RestrictionTags workingCase={workingCase} />
            </Box>
          )}
        </Box>
        {completedCaseStates.includes(workingCase.state) &&
          isRestrictionCase(workingCase.type) &&
          workingCase.state === CaseState.ACCEPTED && (
            <CaseDates workingCase={workingCase} />
          )}
      </Box>
      {completedCaseStates.includes(workingCase.state) &&
        workingCase.caseModifiedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              type="info"
              title={formatMessage(defenderCaseOverview.modifiedDatesHeading, {
                caseType: workingCase.type,
              })}
              message={
                <MarkdownWrapper
                  markdown={workingCase.caseModifiedExplanation}
                  textProps={{ variant: 'small' }}
                />
              }
            />
          </Box>
        )}
    </FormContentContainer>
  )
}

export default CaseOverviewForm
