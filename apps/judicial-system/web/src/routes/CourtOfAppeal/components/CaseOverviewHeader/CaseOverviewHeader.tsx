import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseDecision,
  CaseState,
  EventLog,
  EventType,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import {
  CaseDates,
  FormContext,
  MarkdownWrapper,
  OverviewHeader,
  RestrictionTags,
} from '@island.is/judicial-system-web/src/components'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  CaseAppealDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { courtOfAppealCaseOverviewHeader as strings } from './CaseOverviewHeader.strings'

const CourtOfAppealCaseOverviewHeader: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const router = useRouter()

  const filteredEvents = workingCase?.eventLogs
    ?.filter(
      (e) =>
        e.eventType === EventType.APPEAL_RESULT_ACCESSED &&
        [
          UserRole.DEFENDER,
          UserRole.PROSECUTOR,
          UserRole.PRISON_SYSTEM_STAFF,
        ].includes(e.userRole as UserRole),
    )
    .reduce((acc, event) => {
      const userRole = event.userRole as UserRole
      const existingEventIndex = acc.findIndex((e) => e.userRole === userRole)

      if (existingEventIndex === -1) {
        acc.push(event)
      } else if (event.created < acc[existingEventIndex].created) {
        acc[existingEventIndex] = event
      }

      return acc
    }, [] as EventLog[])

  const wasAppealedAfterDeadline =
    workingCase.appealedDate &&
    workingCase.appealDeadline &&
    workingCase.appealedDate > workingCase.appealDeadline

  return (
    <>
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(constants.COURT_OF_APPEAL_CASES_ROUTE)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
      </Box>
      {!workingCase.appealRulingDecision && wasAppealedAfterDeadline && (
        <Box marginBottom={5}>
          <AlertMessage
            message={formatMessage(strings.appealSentAfterDeadline)}
            type="warning"
          />
        </Box>
      )}
      {workingCase.appealRulingDecision &&
        workingCase.eventLogs &&
        workingCase.eventLogs.length > 0 && (
          <Box marginBottom={4} marginTop={8}>
            {filteredEvents?.map((event, index) => (
              <Box marginBottom={2} key={`event${index}`}>
                <AlertMessage
                  message={formatMessage(strings.appealResultOpenedBy, {
                    userRole: event.userRole as UserRole,
                    when: formatDate(event.created, 'PPPp'),
                  })}
                  type="info"
                />
              </Box>
            ))}
          </Box>
        )}

      <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
        <Box>
          <OverviewHeader />

          {workingCase.rulingDate && (
            <Box>
              <RulingDateLabel rulingDate={workingCase.rulingDate} />
            </Box>
          )}
          {workingCase.appealedDate && (
            <Box marginTop={1}>
              <Text as="h5" variant="h5">
                {workingCase.prosecutorAppealDecision ===
                  CaseAppealDecision.APPEAL ||
                workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                  ? formatMessage(strings.appealedByInCourt, {
                      appealedByProsecutor:
                        workingCase.appealedByRole === UserRole.PROSECUTOR,
                    })
                  : formatMessage(strings.appealedBy, {
                      appealedByProsecutor:
                        workingCase.appealedByRole === UserRole.PROSECUTOR,
                      appealedDate: `${formatDate(
                        workingCase.appealedDate,
                        'PPPp',
                      )}`,
                    })}
              </Text>
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <RestrictionTags workingCase={workingCase} />
        </Box>
      </Box>
      <Box marginBottom={5}>
        {isRestrictionCase(workingCase.type) &&
          workingCase.decision !==
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN &&
          workingCase.state === CaseState.ACCEPTED && (
            <CaseDates workingCase={workingCase} />
          )}
      </Box>
      {workingCase.caseModifiedExplanation && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyDatesInfo.title, {
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
      {workingCase.rulingModifiedHistory && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyRulingInfo.title)}
            message={
              <MarkdownWrapper
                markdown={workingCase.rulingModifiedHistory}
                textProps={{ variant: 'small' }}
              />
            }
          />
        </Box>
      )}
    </>
  )
}

export default CourtOfAppealCaseOverviewHeader
