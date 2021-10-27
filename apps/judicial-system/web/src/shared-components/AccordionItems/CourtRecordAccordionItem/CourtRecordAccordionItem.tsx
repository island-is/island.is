import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import {
  capitalize,
  caseTypes,
  formatAccusedByGender,
  formatAlternativeTravelBanRestrictions,
  formatAppeal,
  formatCustodyRestrictions,
  formatDate,
  NounCases,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import {
  AccusedPleaDecision,
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import AccordionListItem from '../../AccordionListItem/AccordionListItem'
import { closedCourt } from '@island.is/judicial-system-web/messages'
import { useIntl } from 'react-intl'
import { courtRecordAccordion as m } from '@island.is/judicial-system-web/messages/Core/courtRecordAccordion'
import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'
import { rcConfirmation } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
}
const CourtRecordAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()

  const custodyRestrictions = formatCustodyRestrictions(
    workingCase.accusedGender,
    workingCase.custodyRestrictions,
  )

  const alternativeTravelBanRestrictions = formatAlternativeTravelBanRestrictions(
    workingCase.accusedGender,
    workingCase.custodyRestrictions,
    workingCase.otherRestrictions,
  )

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
          <Text>
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {`Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.\n\n${
                isRestrictionCase(workingCase.type)
                  ? capitalize(
                      formatAccusedByGender(
                        workingCase.accusedGender,
                        NounCases.GENITIVE,
                      ),
                    )
                  : 'Varnaraðila'
              } er kynnt krafa á dómskjali nr. 1.`}
            </span>
          </Text>
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
      {(isRestrictionCase(workingCase.type) ||
        workingCase.sessionArrangements !==
          SessionArrangements.REMOTE_SESSION) && (
        <Box marginBottom={3}>
          <Text>{formatMessage(m.sections.conclusion.disclaimer)}</Text>
        </Box>
      )}
      <Box component="section" marginBottom={3}>
        <AccordionListItem title="Ákvörðun um kæru">
          <Box marginBottom={2}>
            <Text>{formatMessage(m.sections.appealDecision.disclaimer)}</Text>
          </Box>
          {workingCase.prosecutorAppealDecision !==
            CaseAppealDecision.NOT_APPLICABLE && (
            <Box marginBottom={1}>
              <Text variant="h4">
                {formatAppeal(workingCase.prosecutorAppealDecision, 'Sækjandi')}
              </Text>
            </Box>
          )}
          {workingCase.accusedAppealDecision !==
            CaseAppealDecision.NOT_APPLICABLE && (
            <Text variant="h4">
              {formatAppeal(
                workingCase.accusedAppealDecision,
                isRestrictionCase(workingCase.type)
                  ? capitalize(formatAccusedByGender(workingCase.accusedGender))
                  : 'Varnaraðili',
                isRestrictionCase(workingCase.type)
                  ? workingCase.accusedGender
                  : undefined,
              )}
            </Text>
          )}
        </AccordionListItem>
      </Box>
      {(workingCase.accusedAppealAnnouncement ||
        workingCase.prosecutorAppealAnnouncement) && (
        <Box component="section" marginBottom={6}>
          {workingCase.accusedAppealAnnouncement &&
            workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL && (
              <Box marginBottom={2}>
                <Text variant="eyebrow" color="blue400">
                  {`Yfirlýsing um kæru ${formatAccusedByGender(
                    workingCase.accusedGender,
                    NounCases.GENITIVE,
                    isInvestigationCase(workingCase.type),
                  )}`}
                </Text>
                <Text>{workingCase.accusedAppealAnnouncement}</Text>
              </Box>
            )}
          {workingCase.prosecutorAppealAnnouncement &&
            workingCase.prosecutorAppealDecision ===
              CaseAppealDecision.APPEAL && (
              <Box marginBottom={2}>
                <Text variant="eyebrow" color="blue400">
                  Yfirlýsing um kæru sækjanda
                </Text>
                <Text>{workingCase.prosecutorAppealAnnouncement}</Text>
              </Box>
            )}
        </Box>
      )}
      {workingCase.type === CaseType.CUSTODY &&
        workingCase.decision === CaseDecision.ACCEPTING && (
          <AccordionListItem title="Tilhögun gæsluvarðhalds">
            {custodyRestrictions && (
              <Box marginBottom={2}>
                <Text>{custodyRestrictions}</Text>
              </Box>
            )}
            <Text>
              {formatMessage(
                rcConfirmation.sections.custodyRestrictions.disclaimer,
                {
                  caseType: 'gæsluvarðhaldsins',
                },
              )}
            </Text>
          </AccordionListItem>
        )}
      {((workingCase.type === CaseType.CUSTODY &&
        workingCase.decision ===
          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) ||
        (workingCase.type === CaseType.TRAVEL_BAN &&
          workingCase.decision === CaseDecision.ACCEPTING)) && (
        <AccordionListItem title="Tilhögun farbanns">
          {alternativeTravelBanRestrictions && (
            <Box marginBottom={2}>
              <Text>
                {alternativeTravelBanRestrictions
                  .split('\n')
                  .map((str, index) => {
                    return (
                      <div key={index}>
                        <Text>{str}</Text>
                      </div>
                    )
                  })}
              </Text>
            </Box>
          )}
          <Text>
            {formatMessage(
              rcConfirmation.sections.custodyRestrictions.disclaimer,
              {
                caseType: 'farbannsins',
              },
            )}
          </Text>
        </AccordionListItem>
      )}
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
