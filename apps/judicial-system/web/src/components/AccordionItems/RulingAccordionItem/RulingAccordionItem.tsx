import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages/Core/rulingAccordion'

interface Props {
  workingCase: Case
  startExpanded?: boolean
}

const RulingAccordionItem: React.FC<Props> = ({
  workingCase,
  startExpanded,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem
      id="rulingAccordionItem"
      label={formatMessage(m.heading)}
      labelVariant="h3"
      labelUse="h2"
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
            {formatMessage(m.sections.prosecutorDemands.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{workingCase.prosecutorDemands}</Text>
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
        <Text variant="eyebrow" color="blue400">
          {formatMessage(m.sections.ruling.title)}
        </Text>
        <Text whiteSpace="breakSpaces">{workingCase.ruling}</Text>
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
