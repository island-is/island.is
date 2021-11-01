import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import { isInvestigationCase } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages/Core/rulingAccordion'
import * as style from './RulingAccordionItem.css'

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
        {isInvestigationCase(workingCase.type) &&
          workingCase.requestProsecutorOnlySession && (
            <Box marginY={2}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  {formatMessage(m.sections.requestProsecutorOnlySession.title)}
                </Text>
              </Box>
              <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
            </Box>
          )}
        <Text variant="eyebrow" color="blue400">
          {formatMessage(m.sections.ruling.title)}
        </Text>
        <Text>
          <span className={style.breakSpaces}>{workingCase.ruling}</span>
        </Text>
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
