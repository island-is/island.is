import { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages'
import { CaseDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { AccordionListItem } from '../..'

interface Props {
  workingCase: Case
  startExpanded?: boolean
}

const RulingAccordionItem: FC<Props> = ({
  workingCase,
  startExpanded,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem
      id="rulingAccordionItem"
      label={formatMessage(m.heading)}
      labelVariant="h3"
      labelUse="h3"
      startExpanded={startExpanded}
    >
      <Box component="section">
        {workingCase.decision === CaseDecision.COMPLETED_WITHOUT_RULING ? (
          <Box marginBottom={2}>
            <Text as="h4" variant="h4">
              {formatMessage(m.sections.noRuling.title)}
            </Text>
          </Box>
        ) : (
          <>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                {formatMessage(m.title)}
              </Text>
            </Box>
            <AccordionListItem
              title={formatMessage(m.sections.prosecutorDemands.title)}
            >
              <Text>{workingCase.prosecutorDemands}</Text>
            </AccordionListItem>
            <AccordionListItem
              title={formatMessage(m.sections.courtCaseFacts.title)}
            >
              <Text>{workingCase.courtCaseFacts}</Text>
            </AccordionListItem>
            <AccordionListItem
              title={formatMessage(m.sections.courtLegalArguments.title)}
            >
              <Text>{workingCase.courtLegalArguments}</Text>
            </AccordionListItem>
            <AccordionListItem title={formatMessage(m.sections.ruling.title)}>
              <Text whiteSpace="breakSpaces">{workingCase.ruling}</Text>
            </AccordionListItem>
          </>
        )}
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
