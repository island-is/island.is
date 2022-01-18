import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

import {
  capitalize,
  formatAppeal,
  formatDate,
  TIME_FORMAT,
  formatRequestCaseType,
} from '@island.is/judicial-system/formatters'
import {
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import { closedCourt, core } from '@island.is/judicial-system-web/messages'
import { courtRecordAccordion as m } from '@island.is/judicial-system-web/messages/Core/courtRecordAccordion'
import type { Case } from '@island.is/judicial-system/types'

import AccordionListItem from '../../AccordionListItem/AccordionListItem'

interface Props {
  workingCase: Case
}

const CourtRecordAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()

  const prosecutorAppeal = formatAppeal(
    workingCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  const accusedAppeal = workingCase.defendants
    ? formatAppeal(
        workingCase.accusedAppealDecision,
        capitalize(
          isRestrictionCase(workingCase.type)
            ? formatMessage(core.accused, { suffix: 'i' })
            : formatMessage(core.defendant, {
                suffix: workingCase.defendants?.length > 1 ? 'ar' : 'i',
              }),
        ),
        isRestrictionCase(workingCase.type)
          ? workingCase.defendants && workingCase.defendants[0].gender
          : undefined,
      )
    : ''

  return (
    <AccordionItem
      id="courtRecordAccordionItem"
      label="Þingbók"
      labelVariant="h3"
    >
      <AccordionListItem
        title={formatMessage(m.sections.timeAndLocation.title)}
      >
        <Text>
          {workingCase.courtEndTime
            ? formatMessage(m.sections.timeAndLocation.text, {
                courtStartTime: formatDate(
                  workingCase.courtStartDate,
                  TIME_FORMAT,
                ),
                courtEndTime: formatDate(workingCase.courtEndTime, TIME_FORMAT),
                courtEndDate: formatDate(workingCase.courtEndTime, 'PP'),
                courtLocation: workingCase.courtLocation,
              })
            : formatMessage(m.sections.timeAndLocation.textOngoing, {
                courtStartTime: formatDate(
                  workingCase.courtStartDate,
                  TIME_FORMAT,
                ),
              })}
        </Text>
        {!workingCase.isClosedCourtHidden && (
          <Box marginBottom={3}>
            <Text>{formatMessage(closedCourt.text)}</Text>
          </Box>
        )}
      </AccordionListItem>
      {workingCase.courtAttendees?.trim() && (
        <AccordionListItem
          title={formatMessage(m.sections.courtAttendees.title)}
          breakSpaces
        >
          <Text>{workingCase.courtAttendees.trim()}</Text>
        </AccordionListItem>
      )}
      <AccordionListItem title={formatMessage(m.sections.courtDocuments.title)}>
        <Text>{`${formatMessage(core.requestCaseType, {
          caseType: formatRequestCaseType(workingCase.type),
        })} þingmerkt nr. 1.`}</Text>
        <Text>
          Rannsóknargögn málsins liggja frammi.
          <br />
          <br />
          {workingCase.courtDocuments?.map((courtDocument, index) => {
            return (
              <>
                {`${capitalize(courtDocument)} þingmerkt nr. ${index + 2}.`}
                {index <= (workingCase.courtDocuments ?? []).length && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </>
            )
          })}
        </Text>
      </AccordionListItem>
      {workingCase.accusedBookings?.trim() && (
        <AccordionListItem
          title={formatMessage(m.sections.accusedBookings.title, {
            accusedType: formatMessage(
              isRestrictionCase(workingCase.type)
                ? core.accused
                : core.defendant,
              {
                suffix: 'a',
              },
            ),
          })}
          breakSpaces
        >
          <Text>{workingCase.accusedBookings.trim()}</Text>
        </AccordionListItem>
      )}
      <AccordionListItem title="Málflutningur" breakSpaces>
        <Text>{workingCase.litigationPresentations}</Text>
      </AccordionListItem>
      {isRestrictionCase(workingCase.type) && (
        <Box marginBottom={3}>
          <Text>{formatMessage(m.sections.conclusion.disclaimer)}</Text>
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
                  {formatMessage(m.sections.appealDecision.disclaimer)}
                </Text>
              </Box>
            )}
            <Box marginBottom={2}>
              <Text>
                {`${prosecutorAppeal}${
                  workingCase.prosecutorAppealAnnouncement
                    ? ` ${workingCase.prosecutorAppealAnnouncement}`
                    : ''
                }`}
              </Text>
            </Box>
            <Text>
              {`${accusedAppeal}${
                workingCase.accusedAppealAnnouncement
                  ? ` ${workingCase.accusedAppealAnnouncement}`
                  : ''
              }`}
            </Text>
          </AccordionListItem>
        </Box>
      }
      {workingCase.endOfSessionBookings && (
        <AccordionListItem
          title={formatMessage(m.sections.endOfSessionBookings.title)}
          breakSpaces
        >
          <Text>{workingCase.endOfSessionBookings}</Text>
        </AccordionListItem>
      )}
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
