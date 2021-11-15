import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import {
  Case,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages/Core/rulingAccordion'
import * as style from './RulingAccordionItem.css'
import {
  capitalize,
  formatAccusedByGender,
  formatAppeal,
  NounCases,
} from '@island.is/judicial-system/formatters'

interface Props {
  workingCase: Case
  startExpanded?: boolean
}

const RulingAccordionItem: React.FC<Props> = ({
  workingCase,
  startExpanded,
}: Props) => {
  const { formatMessage } = useIntl()
  const prosecutorAppeal = formatAppeal(
    workingCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  const accusedAppeal = formatAppeal(
    workingCase.accusedAppealDecision,
    capitalize(
      formatAccusedByGender(
        workingCase.accusedGender,
        NounCases.NOMINATIVE,
        isInvestigationCase(workingCase.type),
      ),
    ),
    workingCase.accusedGender,
  )

  return (
    <AccordionItem
      id="rulingAccordionItem"
      label={formatMessage(m.heading)}
      labelVariant="h3"
      startExpanded={startExpanded}
    >
      <Box component="section">
        <Box marginBottom={2}>
          <Text as="h4" variant="h4">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            {formatMessage(m.sections.courtCaseFacts.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{workingCase.courtCaseFacts}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            {formatMessage(m.sections.courtLegalArguments.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{workingCase.courtLegalArguments}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            {formatMessage(m.sections.ruling.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>
            <span className={style.breakSpaces}>{workingCase.ruling}</span>
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            {formatMessage(m.sections.appealDecisions.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          {(isRestrictionCase(workingCase.type) ||
            workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT) && (
            <Text>
              {formatMessage(m.sections.appealDecisions.appealDirections)}
            </Text>
          )}
        </Box>
        <Box marginBottom={2}>
          <Text>{`${prosecutorAppeal}${
            workingCase.prosecutorAppealAnnouncement
              ? ` ${workingCase.prosecutorAppealAnnouncement}`
              : ''
          }`}</Text>
        </Box>
        <Text>{`${accusedAppeal}${
          workingCase.accusedAppealAnnouncement
            ? ` ${workingCase.accusedAppealAnnouncement}`
            : ''
        }`}</Text>
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
