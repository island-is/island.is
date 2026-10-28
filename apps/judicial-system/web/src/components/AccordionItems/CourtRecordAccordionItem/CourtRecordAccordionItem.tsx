import type { FC } from 'react'
import { useIntl } from 'react-intl'
import isSameDay from 'date-fns/isSameDay'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatAppeal,
  formatDate,
  formatRequestCaseType,
} from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { closedCourt, core } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import AccordionListItem from '@island.is/judicial-system-web/src/components/AccordionListItem/AccordionListItem'
import {
  AppealDecisionPartyRole,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  caseLevelAppealAnnouncement,
  caseLevelAppealDecision,
} from '@island.is/judicial-system-web/src/utils/utils'

import { courtRecordAccordion as m } from './CourtRecordAccordion.strings'

interface Props {
  workingCase: WorkingCase
}

const CourtRecordAccordionItem: FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()

  const prosecutorAppealAnnouncement = caseLevelAppealAnnouncement(
    workingCase.appealDecisions,
    AppealDecisionPartyRole.PROSECUTOR,
  )
  const accusedAppealAnnouncement = caseLevelAppealAnnouncement(
    workingCase.appealDecisions,
    AppealDecisionPartyRole.DEFENDANT,
  )

  const prosecutorAppeal = formatAppeal(
    caseLevelAppealDecision(
      workingCase.appealDecisions,
      AppealDecisionPartyRole.PROSECUTOR,
    ),
    'Sækjandi',
  )

  const accusedAppeal = formatAppeal(
    caseLevelAppealDecision(
      workingCase.appealDecisions,
      AppealDecisionPartyRole.DEFENDANT,
    ),
    capitalize(
      formatMessage(core.defendant, {
        suffix:
          workingCase.defendants && workingCase.defendants?.length > 1
            ? 'ar'
            : 'i',
      }),
    ),
  )

  return (
    <AccordionItem
      id="courtRecordAccordionItem"
      label={m.title}
      labelVariant="h3"
      labelUse="h3"
    >
      <AccordionListItem
        title={m.sections.timeAndLocation.title}
      >
        <Text>
          {!workingCase.courtEndTime
            ? formatMessage({ id: m.sections.timeAndLocation.textOngoing, defaultMessage: m.sections.timeAndLocation.textOngoing }, {
                courtStartTime: formatDate(
                  workingCase.courtStartDate,
                  TIME_FORMAT,
                ),
              })
            : workingCase.courtStartDate &&
              isSameDay(
                new Date(workingCase.courtStartDate),
                new Date(workingCase.courtEndTime),
              )
            ? formatMessage({ id: m.sections.timeAndLocation.textSameDay, defaultMessage: m.sections.timeAndLocation.textSameDay }, {
                courtStartDate: formatDate(workingCase.courtStartDate, 'PPP'),
                courtStartTime: formatDate(
                  workingCase.courtStartDate,
                  TIME_FORMAT,
                ),
                courtEndTime: formatDate(workingCase.courtEndTime, TIME_FORMAT),
                courtLocation: workingCase.courtLocation,
              })
            : formatMessage({ id: m.sections.timeAndLocation.text, defaultMessage: m.sections.timeAndLocation.text }, {
                courtStartDate: formatDate(workingCase.courtStartDate, 'PPP'),
                courtStartTime: formatDate(
                  workingCase.courtStartDate,
                  TIME_FORMAT,
                ),
                courtEndDate: formatDate(workingCase.courtEndTime, 'PPP'),
                courtEndTime: formatDate(workingCase.courtEndTime, TIME_FORMAT),
                courtLocation: workingCase.courtLocation,
              })}{' '}
        </Text>
        {!workingCase.isClosedCourtHidden && (
          <Box marginBottom={3}>
            <Text>{formatMessage(closedCourt.text)}</Text>
          </Box>
        )}
      </AccordionListItem>
      {workingCase.courtAttendees?.trim() && (
        <AccordionListItem
          title={m.sections.courtAttendees.title}
          breakSpaces
        >
          <Text>{workingCase.courtAttendees.trim()}</Text>
        </AccordionListItem>
      )}
      <AccordionListItem title={m.sections.courtDocuments.title}>
        <Text>
          {formatMessage({ id: m.sections.firstCourtDocument, defaultMessage: m.sections.firstCourtDocument }, {
            caseType: formatRequestCaseType(workingCase.type),
          })}
        </Text>
        {workingCase.courtDocuments?.map((courtDocument, index) => {
          return (
            <Text key={`${index}${courtDocument.name}`}>
              {formatMessage({ id: m.sections.courtDocuments.text, defaultMessage: m.sections.courtDocuments.text }, {
                documentName: capitalize(courtDocument.name),
                documentNumber: index + 2,
                submittedBy: courtDocument.submittedBy,
              })}
            </Text>
          )
        })}
      </AccordionListItem>
      <AccordionListItem
        title={m.sections.sessionBookings.title}
        breakSpaces
      >
        <Text>{workingCase.sessionBookings}</Text>
      </AccordionListItem>
      {isRestrictionCase(workingCase.type) && (
        <Box marginBottom={3}>
          <Text>{m.sections.conclusion.disclaimer}</Text>
        </Box>
      )}
      {
        <Box component="section" marginBottom={3}>
          <AccordionListItem title="Ákvörðun um kæru">
            {(isRestrictionCase(workingCase.type) ||
              workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT) && (
              <Box marginBottom={2}>
                <Text>
                  {m.sections.appealDecision.disclaimer}
                </Text>
              </Box>
            )}
            <Box marginBottom={2}>
              <Text>
                {`${prosecutorAppeal}${
                  prosecutorAppealAnnouncement
                    ? ` ${prosecutorAppealAnnouncement}`
                    : ''
                }`}
              </Text>
            </Box>
            <Text>
              {`${accusedAppeal}${
                accusedAppealAnnouncement ? ` ${accusedAppealAnnouncement}` : ''
              }`}
            </Text>
          </AccordionListItem>
        </Box>
      }
      {workingCase.endOfSessionBookings && (
        <AccordionListItem
          title={m.sections.endOfSessionBookings.title}
          breakSpaces
        >
          <Text>{workingCase.endOfSessionBookings}</Text>
        </AccordionListItem>
      )}
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
