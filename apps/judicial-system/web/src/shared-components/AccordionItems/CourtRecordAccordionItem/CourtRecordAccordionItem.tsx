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
  CaseType,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import AccordionListItem from '../../AccordionListItem/AccordionListItem'

interface Props {
  workingCase: Case
}

const CourtRecordAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const isRestrictionCase =
    workingCase.type === CaseType.CUSTODY ||
    workingCase.type === CaseType.TRAVEL_BAN

  return (
    <AccordionItem id="id_2" label="Þingbók" labelVariant="h3">
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Upplýsingar
        </Text>
      </Box>
      <Box marginBottom={3}>
        {workingCase.courtEndTime ? (
          <Text>
            {`Þinghald frá kl. ${formatDate(
              workingCase.courtStartDate,
              TIME_FORMAT,
            )} til kl. ${formatDate(
              workingCase.courtEndTime,
              TIME_FORMAT,
            )} ${formatDate(workingCase.courtEndTime, 'PP')}`}
          </Text>
        ) : (
          <>
            <Text>
              {`Þinghald frá kl. ${formatDate(
                workingCase.courtStartDate,
                TIME_FORMAT,
              )}`}
            </Text>
            <Text>Þinghaldi er ekki lokið</Text>
          </>
        )}
      </Box>
      <AccordionListItem title="Krafa" breakSpaces>
        <Text>{workingCase.prosecutorDemands}</Text>
      </AccordionListItem>
      <AccordionListItem title="Viðstaddir" breakSpaces>
        <Text>{workingCase.courtAttendees}</Text>
      </AccordionListItem>
      <AccordionListItem title="Dómskjöl">
        <Text>{`Krafa ${
          isRestrictionCase
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
      {!workingCase.isAccusedAbsent && (
        <AccordionListItem
          title={`Réttindi ${
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.TRAVEL_BAN
              ? formatAccusedByGender(
                  workingCase.accusedGender,
                  NounCases.GENITIVE,
                )
              : 'varnaraðila'
          }`}
        >
          <Text>
            Sakborning er bent á að honum sé óskylt að svara spurningum er varða
            brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr.
            88/2008. Sakborning er enn fremur áminntur um sannsögli kjósi hann
            að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.
          </Text>
        </AccordionListItem>
      )}
      {workingCase.accusedAppealDecision !==
        CaseAppealDecision.NOT_APPLICABLE && (
        <AccordionListItem
          title={`Afstaða ${
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.TRAVEL_BAN
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
                    workingCase.type === CaseType.CUSTODY ||
                      workingCase.type === CaseType.TRAVEL_BAN
                      ? formatAccusedByGender(workingCase.accusedGender)
                      : 'varnaraðili',
                  )} hafnar kröfunni. `
                : workingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
                ? `${capitalize(
                    workingCase.type === CaseType.CUSTODY ||
                      workingCase.type === CaseType.TRAVEL_BAN
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
