import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import {
  CaseDates,
  CaseTitleInfoAndTags,
  FormContext,
  MarkdownWrapper,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseState,
  EventLog,
  EventType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { courtOfAppealCaseOverviewHeader as strings } from './CaseOverviewHeader.strings'

interface Props {
  alerts?: { message: string }[]
}

const CaseOverviewHeader: FC<Props> = (props) => {
  const { alerts } = props
  const { user } = useContext(UserContext)
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
      } else if (
        (event.created ?? '') < (acc[existingEventIndex].created ?? '')
      ) {
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
            onClick={() => router.push(getStandardUserDashboardRoute(user))}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
      </Box>
      {!workingCase.appealRulingDecision && wasAppealedAfterDeadline && (
        <Box marginBottom={2}>
          <AlertMessage
            message={formatMessage(strings.appealSentAfterDeadline)}
            type="warning"
          />
        </Box>
      )}
      {workingCase.appealRulingDecision &&
        filteredEvents &&
        filteredEvents.length > 0 && (
          <Box marginBottom={2} marginTop={8}>
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
      {alerts?.map((alert) => (
        <Box key={alert.message} marginBottom={2}>
          <AlertMessage
            message={alert.message}
            type="warning"
            testid="requestAppealRulingNotToBePublished"
          />
        </Box>
      ))}
      <Box marginTop={5}>
        <CaseTitleInfoAndTags />
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
      </Box>
    </>
  )
}

export default CaseOverviewHeader
