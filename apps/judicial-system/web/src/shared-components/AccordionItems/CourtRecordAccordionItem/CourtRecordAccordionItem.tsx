import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import {
  capitalize,
  caseTypes,
  formatAccusedByGender,
  formatDate,
  NounCases,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import {
  AccusedPleaDecision,
  CaseAppealDecision,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import AccordionListItem from '../../AccordionListItem/AccordionListItem'
import { closedCourt } from '@island.is/judicial-system-web/messages'
import { useIntl } from 'react-intl'
import { courtRecordAccordion as m } from '@island.is/judicial-system-web/messages/Core/courtRecordAccordion'
import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'

interface Props {
  workingCase: Case
}

const CourtRecordAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem id="id_2" label="Þingbók" labelVariant="h3">
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
      <AccordionListItem title="Krafa" breakSpaces>
        <Text>{workingCase.prosecutorDemands}</Text>
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
        <Text>{`Krafa ${
          isRestrictionCase(workingCase.type)
            ? `um ${caseTypes[workingCase.type]}`
            : `- ${capitalize(caseTypes[workingCase.type])}`
        } þingmerkt nr. 1.`}</Text>
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
      {!workingCase.isAccusedRightsHidden && (
        <AccordionListItem
          title={formatMessage(m.sections.accusedRights.title, {
            accusedType: isRestrictionCase(workingCase.type)
              ? formatAccusedByGender(
                  workingCase.accusedGender,
                  NounCases.GENITIVE,
                )
              : 'varnaraðila',
          })}
        >
          <MarkdownWrapper
            text={m.sections.accusedRights.text}
            format={{
              genderedAccused: isRestrictionCase(workingCase.type)
                ? capitalize(
                    formatAccusedByGender(
                      workingCase.accusedGender,
                      NounCases.GENITIVE,
                    ),
                  )
                : 'Varnaraðila',
            }}
          />
        </AccordionListItem>
      )}
      {workingCase.accusedAppealDecision !==
        CaseAppealDecision.NOT_APPLICABLE && (
        <AccordionListItem
          title={`Afstaða ${
            isRestrictionCase(workingCase.type)
              ? formatAccusedByGender(
                  workingCase.accusedGender,
                  NounCases.GENITIVE,
                )
              : 'varnaraðila'
          }`}
          breakSpaces
        >
          <Text>
            {`${
              workingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
                ? `${capitalize(
                    isRestrictionCase(workingCase.type)
                      ? formatAccusedByGender(workingCase.accusedGender)
                      : 'varnaraðili',
                  )} hafnar kröfunni. `
                : workingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
                ? `${capitalize(
                    isRestrictionCase(workingCase.type)
                      ? formatAccusedByGender(workingCase.accusedGender)
                      : 'varnaraðili',
                  )} samþykkir kröfuna. `
                : ''
            }${workingCase.accusedPleaAnnouncement ?? ''}`}
          </Text>
        </AccordionListItem>
      )}
      <AccordionListItem title="Málflutningur" breakSpaces>
        <Text>{workingCase.litigationPresentations}</Text>
      </AccordionListItem>
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
